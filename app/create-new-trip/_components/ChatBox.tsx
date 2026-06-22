'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUi'
import BadgetUi from './BadgetUi'
import SelectDaysUi from './SelectDaysUi'
import FinalUi from './FinalUi'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetail } from '@/app/provider'
import { v4 as uuidv4 } from 'uuid';

type Message = {
  role: string
  content: string
  ui?: string
}

export type TripInfo = {
  budget: string,
  destination: string,
  duration: string,
  group_size: string,
  origin: string,
  hotels: any,
  itinerary: any,
}

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo>();
  const [finalBotMsg, setFinalBotMsg] = useState('');
  const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const { userDetail } = useUserDetail();

  const onSend = async (overrideInput?: string, forceFinal?: boolean) => {
    const input = overrideInput ?? userInput
    if (!input?.trim()) return

    const newMsg: Message = { role: 'user', content: input }
    setLoading(true)
    setUserInput('')

    if (!forceFinal) {
      setMessages((prev) => [...prev, newMsg])
    }

    const result = await axios.post('/api/aimodel', {
      messages: [...messages, newMsg],
      isFinal: forceFinal ?? false
    })

    console.log("Response:", result.data)

    if (forceFinal) {
      const tripData = result?.data?.trip_plan
      setTripDetail(tripData)
      const tripId = uuidv4();
      await SaveTripDetail({
        tripDetail: tripData,
        tripId: tripId,
        uid: userDetail?._id
      })
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: JSON.stringify(result.data),
        ui: 'showFinal'
      }])
    } else {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: result?.data?.resp,
        ui: result?.data?.ui,
      }])
    }

    setLoading(false)
  }

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === 'final') {
      setFinalBotMsg(lastMsg.content)
      onSend('Ok, Great!', true)
    }
  }, [messages])

  const handleOptionSelect = (value: string) => {
    onSend(value)
  }

  const RenderGenerativeUi = (ui: string, content: string) => {
    if (ui === 'budget') {
      return <BadgetUi onSelectOption={handleOptionSelect} />
    } else if (ui === 'groupSize') {
      return <GroupSizeUi onSelectOption={handleOptionSelect} />
    } else if (ui === 'tripDuration') {
      return <SelectDaysUi onSelectOption={handleOptionSelect} />
    } else if (ui === 'final') {
      return null
    }  else if (ui === 'showFinal') {
  return (
    <>
      {finalBotMsg && (
        <p className='text-sm mb-3'>{finalBotMsg}</p>
      )}
      <FinalUi
        viewTrip={content}
        disable={!tripDetail}
      />
    </>
  )
}
    return null
  }

  return (
    <div className='h-[85vh] flex flex-col'>
      {messages?.length === 0 && (
        <EmptyBoxState
          onSelectOption={(v: string) => {
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
                {msg.ui !== 'final' && msg.ui !== 'showFinal' && msg.content}

                {/* ✅ index condition hatai — ab sab messages apna UI dikhayenge */}
                {RenderGenerativeUi(msg.ui ?? '', msg.content ?? '')}
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