import React, { useState, useEffect } from 'react'
import { checkBackendStatus } from '../utils/api.js'
import './WakeUpBanner.css'

export default function WakeUpBanner() {
  const [state, setState] = useState('checking')

  useEffect(() => {
    let timer
    const SLOW_MS = 1500

    const check = async () => {
      timer = setTimeout(() => setState('sleeping'), SLOW_MS)
      const result = await checkBackendStatus()
      clearTimeout(timer)
      if (result.ok) {
        setState(result.ms > SLOW_MS ? 'awake' : 'fast')
        if (result.ms > SLOW_MS) setTimeout(() => setState('fast'), 3000)
      } else {
        setState('error')
      }
    }

    check()
    return () => clearTimeout(timer)
  }, [])

  if (state === 'fast' || state === 'checking') return null

  if (state === 'sleeping') return (
    <div className="wakeup-banner wakeup-sleeping">
      <div className="wakeup-spinner" />
      <div className="wakeup-text">
        <strong>Waking up the server…</strong>
        <span>Free hosting spins down after inactivity. Usually takes 30–60 seconds.</span>
      </div>
    </div>
  )

  if (state === 'awake') return (
    <div className="wakeup-banner wakeup-awake">
      <ion-icon name="checkmark-circle-outline" />
      <span>Server is awake! Loading your portfolio…</span>
    </div>
  )

  if (state === 'error') return (
    <div className="wakeup-banner wakeup-error">
      <ion-icon name="alert-circle-outline" />
      <span>Backend unavailable. Please refresh in a moment.</span>
    </div>
  )

  return null
}
