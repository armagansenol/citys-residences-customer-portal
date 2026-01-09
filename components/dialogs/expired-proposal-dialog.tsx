"use client"

import { ClockCountdownIcon, PhoneCallIcon, XIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"

interface ExpiredProposalDialogProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  userPhone?: string
}

export function ExpiredProposalDialog({ isOpen, onClose, userName, userPhone }: ExpiredProposalDialogProps) {
  const t = useTranslations("common.expiredProposal")

  // Use provided user info or fallback to translation values
  const displayName = userName || t("representativeName")
  const displayPhone = userPhone || t("representativePhone")

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='fixed left-1/2 top-1/2 z-301 w-full h-full xl:h-auto xl:max-w-[40vw] -translate-x-1/2 -translate-y-1/2'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='relative bg-black/30 backdrop-blur-2xl overflow-hidden h-full w-full flex items-center justify-center'>
              {/* Close Button */}
              <button
                onClick={onClose}
                className='absolute right-4 top-4 z-10 flex items-center justify-center w-8 h-8 text-white hover:bg-white/10 transition-colors gradient-submit-button'
                aria-label='Close'
              >
                <XIcon className='size-6' weight='light' />
              </button>

              <div className='flex flex-col items-center justify-center px-8 py-12 text-center'>
                {/* Clock Icon */}
                <div className='mb-6'>
                  <ClockCountdownIcon className='size-16 text-white' weight='light' />
                </div>

                {/* Title */}
                <h2 className='mb-3 text-2xl font-medium text-white'>{t("title")}</h2>

                {/* Description */}
                <p className='mb-8 text-xl text-white/90'>{t("description")}</p>

                {/* Contact Info */}
                <div className='font-primary mb-6 text-white/90 flex flex-col xl:flex-row items-center justify-center gap-2'>
                  <p className='text-base font-normal'>{displayName}</p>
                  <p className='text-base font-light'>{displayPhone}</p>
                </div>

                {/* Call Button */}
                <a
                  href={`tel:${displayPhone.replace(/\s/g, "")}`}
                  className='font-primary gradient-submit-button inline-flex items-center gap-2 px-20 xl:px-8 py-3 text-white font-medium hover:bg-bricky-brick/90 transition-colors'
                >
                  <PhoneCallIcon className='size-6' weight='regular' />
                  <span className='text-sm font-medium'>{t("callNow")}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
