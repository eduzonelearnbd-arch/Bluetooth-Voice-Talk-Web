import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Phone, PhoneIncoming, PhoneOff } from 'lucide-react';
import { PeerContact } from '../types/app';

interface IncomingCallBannerProps {
  incomingPeer: PeerContact | null;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallBanner: React.FC<IncomingCallBannerProps> = ({
  incomingPeer,
  onAccept,
  onDecline,
}) => {
  return (
    <AnimatePresence>
      {incomingPeer && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Simulated incoming Bluetooth call"
          className="fixed top-4 left-4 right-4 lg:left-auto lg:right-6 lg:w-[400px] z-50 rounded-3xl bg-[#161D2C]/95 backdrop-blur-xl border border-blue-400/35 shadow-2xl p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-display font-semibold text-sm shrink-0 ${incomingPeer.accentColor}`}
              >
                {incomingPeer.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-blue-300 font-medium">
                  <PhoneIncoming className="w-3.5 h-3.5" />
                  <span>Incoming Voice Call · DEMO</span>
                </div>
                <p className="font-display text-base font-semibold text-slate-100 truncate mt-0.5">
                  {incomingPeer.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {incomingPeer.deviceLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onDecline}
              className="min-h-[44px] rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Decline</span>
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Answer (Demo)</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
