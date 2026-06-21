'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send, TruckElectric } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUi'
import BadgetUi from './BadgetUi'
import SelectDaysUi from './SelectDaysUi'   // ← new
import FinalUi from './FinalUi'             // ← new

type Message = {
  role: string
  content: string
  ui?: string
}

 export type TripInfo ={
    budget:string,
    destination:string,
    duration:string,
    group_size :string,
    origin:string,
    hotels:any,
    itinerary:any,

}

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isFinal,setIsFinal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tripDetail,setTripDetail]= useState<TripInfo>();

  const onSend = async (overrideInput?: string) => {
    const input = overrideInput ?? userInput
    if (!input?.trim()) return

    const newMsg: Message = { role: 'user', content: input }
    setLoading(true)
    setUserInput('')
    setMessages((prev) => [...prev, newMsg])

    const result = await axios.post('/api/aimodel', {
      messages: [...messages, newMsg],
      isFinal:isFinal
    })
      console.log("Trip"+result.data)

    !isFinal&&setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: result?.data?.resp,
        ui: result?.data?.ui,
      },
    ])
    if(isFinal){
        setTripDetail(result?.data?.trip_plan);
    }
  
    setLoading(false)
  }

  // Called when user picks an option from any generative UI card
  const handleOptionSelect = (value: string) => {
    setUserInput(value)
    onSend(value)
  }

  const RenderGenerativeUi = (ui: string, content: string) => {
    if (ui === 'budget') {
      return <BadgetUi onSelectOption={handleOptionSelect} />
    } else if (ui === 'groupSize') {
      return <GroupSizeUi onSelectOption={handleOptionSelect} />
    } else if (ui === 'tripDuration') {
      // ← new
      return <SelectDaysUi onSelectOption={handleOptionSelect} />
    } else if (ui === 'final') {
      // ← new — pass the full AI content so FinalUi can parse the trip JSON
      return <FinalUi viewTrip={content}
      disable={!tripDetail}
      />
    }
    return null
  }
  useEffect(()=>{
    const lastMsg=messages[messages.length-1];
    if(lastMsg?.ui=='final'){
        setIsFinal(true);
        setUserInput('Ok, Great!')
        onSend();
    }
  },[messages])

  return (
    <div className='h-[85vh] flex flex-col'>
      {messages?.length === 0 && (
        <EmptyBoxState
          onSelectOption={(v: string) => {
            setUserInput(v)
            onSend(v)
          }}
        />
      )}

      <section className='flex-1 overflow-y-auto p-4'>
        {messages.map((msg: Message, index) =>
          msg.role === 'user' ? (
            <div className='flex justify-end mt-2' key={index}>
              <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                {msg.content}
              </div>
            </div>
          ) : (
            <div className='flex justify-start mt-2' key={index}>
              <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                {/* Don't show raw JSON when ui==='final', only show text otherwise */}
                {msg.ui !== 'final' && msg.content}

                {/* Always show generative UI for latest assistant message */}
                {index === messages.length - 1 &&
                  RenderGenerativeUi(msg.ui ?? '', msg.content ?? '')}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className='flex justify-start mt-2'>
            <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
              <Loader className='animate-spin' />
            </div>
          </div>
        )}
      </section>

      <section>
        <div className='border rounded-2xl p-4 relative'>
          <Textarea
            placeholder='Start typing here...'
            className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
          />
          <Button
            size={'icon'}
            className='absolute bottom-6 right-6'
            onClick={() => onSend()}
          >
            <Send className='w-4 h-4' />
          </Button>
        </div>
      </section>
    </div>
  )
}

export default ChatBox