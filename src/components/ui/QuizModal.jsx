import { QUIZ_OPTIONS } from '../../data/adab'
import { CHECKPOINTS, RULES } from '../../config/track'
import { useGameStore } from '../../store/gameStore'
import { BigButton, Overlay } from './primitives'
import FacelessIllustration from './FacelessIllustrations'
import AdabkuLogo from './AdabkuLogo'

/**
 * Pop-up Kuis Adab:
 * - Level 1-3: Kuis di checkpoint lintasan (Masjid, Sekolah, Rumah)
 * - Level 4: Kuis butiran orb adab bergambar faceless di arena
 */
export default function QuizModal() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const activeQuiz = useGameStore((s) => s.activeQuiz)
  const checkpointIndex = useGameStore((s) => s.checkpointIndex)
  const answerQuiz = useGameStore((s) => s.answerQuiz)
  const closeQuiz = useGameStore((s) => s.closeQuiz)
  const answerLevel4Quiz = useGameStore((s) => s.answerLevel4Quiz)
  const closeLevel4Orb = useGameStore((s) => s.closeLevel4Orb)

  if (!activeQuiz) return null
  const { quiz, picked, correct } = activeQuiz
  const opts = QUIZ_OPTIONS[quiz.type] || QUIZ_OPTIONS.prinsip
  const answered = picked !== null
  const isLevel5 = currentLevel === 5

  const handleAnswer = (val) => {
    if (isLevel5) {
      answerLevel4Quiz(val)
    } else {
      answerQuiz(val)
    }
  }

  const handleClose = () => {
    if (isLevel5) {
      closeLevel4Orb()
    } else {
      closeQuiz()
    }
  }

  const optionClass = (value) =>
    answered && picked !== value && quiz.answer !== value ? 'opacity-40' : ''

  return (
    <Overlay labelledBy="quiz-question">
      {/* Header Logo Adabku Bulat & Badge */}
      <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <AdabkuLogo size="xs" />
          <span className="font-display text-sm font-black text-emerald-800">
            Adabku
          </span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-display text-[11px] font-black text-emerald-800">
            {isLevel5 ? '✨ Soal Arena' : `Kuis ${checkpointIndex + 1}/${CHECKPOINTS.length}`}
          </span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold text-white ${
            quiz.type === 'kasus' ? 'bg-sky-500' : 'bg-emerald-600'
          }`}
        >
          {opts.badge}
        </span>
      </div>

      {/* Ilustrasi Edukasi Faceless */}
      <div className="mb-3 overflow-hidden rounded-2xl border border-emerald-100 shadow-sm">
        <FacelessIllustration
          type={quiz.illustration || 'default'}
          className="h-32 sm:h-36 w-full"
        />
      </div>

      <h2
        id="quiz-question"
        className="mb-4 font-display text-lg sm:text-xl leading-snug font-bold text-ink"
      >
        {quiz.question}
      </h2>

      {/* Tombol Opsi Jawaban */}
      <div className="grid grid-cols-2 gap-3">
        <BigButton
          id="quiz-answer-yes"
          variant="green"
          disabled={answered}
          className={optionClass(true)}
          onClick={() => handleAnswer(true)}
        >
          {answered && quiz.answer === true ? '✓ ' : ''}
          {opts.yes}
        </BigButton>
        <BigButton
          id="quiz-answer-no"
          variant="orange"
          disabled={answered}
          className={optionClass(false)}
          onClick={() => handleAnswer(false)}
        >
          {answered && quiz.answer === false ? '✓ ' : ''}
          {opts.no}
        </BigButton>
      </div>

      {/* Umpan Balik Jawaban */}
      {answered && (
        <div
          className={`mt-4 animate-pop rounded-2xl border-2 p-3.5 ${
            correct ? 'border-emerald-500 bg-emerald-50/90' : 'border-amber-400 bg-amber-50/90'
          }`}
        >
          <p className="font-display text-lg font-black text-ink">
            {correct ? '🌟 Masya Allah, jawabanmu tepat!' : '🌱 Jawaban yang benar adalah:'}
          </p>

          <p className="mt-1 text-xs sm:text-sm font-extrabold text-emerald-800">
            {correct
              ? isLevel5
                ? `+${RULES.pointsQuiz} ⭐ | +3 💧 Amunisi Air | +1 🛡️ Perisai`
                : `+${RULES.pointsQuiz} ⭐ & 🛡️ Dapat 1 Perisai Adab`
              : 'Teruslah belajar adab yang baik!'}
          </p>

          <p className="mt-2 font-semibold text-xs sm:text-sm text-ink-soft">
            {quiz.explanation}
          </p>

          <BigButton
            id="quiz-continue"
            variant="sky"
            className="mt-3.5 w-full"
            onClick={handleClose}
            autoFocus
          >
            {isLevel5 ? 'Kembali ke Arena ▶' : 'Lanjut Meluncur ▶'}
          </BigButton>
        </div>
      )}
    </Overlay>
  )
}
