import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { aj } from "../arcjet/route";
import { auth, currentUser } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
    // model: "gemini-2.0-flash-lite" 
});

const PROMPT = `IMPORTANT: ALWAYS respond ONLY with a valid JSON object in this exact format: {"resp": "your message", "ui": "componentName"}. Never add any text outside the JSON object. Never use markdown. Only JSON.

You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
Only ask questions about the following details in order, and wait for the user's answer before asking the next:
1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)
7. Special requirements or preferences (if any)

Do not ask multiple questions at once, and never ask irrelevant questions.
Always maintain a conversational, interactive style while asking questions.

CRITICAL - HANDLING UNCLEAR OR AMBIGUOUS ANSWERS:
- If the user gives a vague, non-committal, or unclear answer (e.g., "yes", "no", "okay", "you suggest", "all", "anything"), ask AT MOST ONE clarifying follow-up question for that specific field.
- If the user's second answer is STILL unclear or non-committal, DO NOT ask again. Instead, make a reasonable, sensible assumption on their behalf, briefly state the assumption you're making, and move on to the next question immediately.
- Never ask more than 2 total questions (1 original + 1 clarification) about the same field. After that, always proceed forward with your best judgment.
- Example: If user says "you suggest" or "anything" for interests, pick a sensible default (e.g., "sightseeing and cultural experiences") and move to the next question, mentioning what you picked.

Along with response also send which ui component to display for generate UI. The "ui" value MUST be EXACTLY one of these (case-sensitive): "budget", "groupSize", "tripDuration", "", "final".

- Use "budget" when asking about budget.
- Use "groupSize" when asking about group size.
- Use "tripDuration" when asking about number of days.
- Use "" (empty string) when asking about travel interests or special requirements so the user can type the answer.
- Use "final" once all information is collected and you are ready to generate the trip.

Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with following JSON schema:
{
  "resp": "Text Resp",
  "ui": "budget" | "groupSize" | "tripDuration" | "final"
}`

const FINAL_PROMPT = `
You are an AI Travel Planner.

Based on the complete conversation, generate a detailed travel plan.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT include explanations or extra text.
- Do NOT wrap the JSON in \`\`\`.
- Fill every field with realistic values.
- Return at least 3 hotel recommendations.
- Return a complete itinerary for every day of the trip.
- Use valid image URLs whenever possible.
- Rating must be a number between 1 and 5.
- Latitude and longitude must be numbers.
- Prices should be in Indian Rupees (₹).

Return the response in this exact JSON format:

{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",

    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "₹2500",
        "hotel_image_url": "https://example.com/image.jpg",
        "geo_coordinates": {
          "latitude": 0,
          "longitude": 0
        },
        "rating": 4.5,
        "description": "string"
      }
    ],

    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",

        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "https://example.com/image.jpg",

            "geo_coordinates": {
              "latitude": 0,
              "longitude": 0
            },

            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}
`;
export async function POST(req: NextRequest) {
  const { messages, isFinal } = await req.json();

  const user = await currentUser();
  const {has} = await auth();
  const hasPremiumAccess = has({ plan: 'monthly' })
  console.log("hasPrimumAccess", hasPremiumAccess);
   const decision = await aj.protect(req,{userId:user?.primaryEmailAddress?.emailAddress??'', requested:isFinal?5:0});
   console.log("Arcjet decision", decision);
   //@ts-ignore
   if(decision?.reason?.remaining==0 && !hasPremiumAccess){
    return NextResponse.json({ 
      resp:'No Free Credit Remaining',
      ui:'limit'
   });

   }
  try {
    
    // Strip out any extra fields (like "ui") that the AI API doesn't accept
    const cleanMessages = (messages ?? []).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

  const prompt = `
${isFinal ? FINAL_PROMPT : PROMPT}

Conversation:
${cleanMessages
  .map((m: any) => `${m.role}: ${m.content}`)
  .join("\n")}
`;

const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
  generationConfig: {
    responseMimeType: "application/json",
  },
});

const raw = result.response.text();
    const parsed = safeParseJson(raw);
    console.log(parsed);

    if (!parsed) {
    
      return NextResponse.json({
        resp: "Sorry, I had trouble understanding that. Could you please rephrase your last answer?",
        ui: ''
      });
    }

    return NextResponse.json(parsed);
  }
  catch (e: any) {
    console.error("AI model route error:", e);
    return NextResponse.json(
      { resp: "Something went wrong on our end. Please try again.", ui: '' },
      { status: 200 }
    );
  }
}

function safeParseJson(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}