import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import { Play, Sparkles, ArrowLeft, CheckCircle2, XCircle, MessageSquare, ArrowRight, Trophy } from 'lucide-react';
import { courses } from '../data/courses';
import { evaluateCodeWithAI, askAITutor } from '../services/ai';
import { useProgress } from '../context/ProgressContext';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export function Lesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson, hasCompleted } = useProgress();

  const course = courses.find(c => c.id === courseId);
  const lessonIndex = course?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const lesson = course?.lessons[lessonIndex];

  const [code, setCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{status: 'success'|'error', message: string} | null>(null);
  
  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setCode(lesson.initialCode);
      setFeedback(null);
      setChatMessages([]);
      setIsChatOpen(false);
    }
  }, [lessonId]);

  if (!course || !lesson) {
    return <div className="p-8 text-white">Lição não encontrada.</div>;
  }

  const handleRunCode = async () => {
    setIsEvaluating(true);
    setFeedback(null);
    
    const result = await evaluateCodeWithAI(lesson.objective, code, lesson.language);
    
    setFeedback(result);
    setIsEvaluating(false);

    if (result.status === 'success') {
      completeLesson(lesson.id);
    }
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    const aiResponse = await askAITutor(userMsg, code, lesson.language);
    
    setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    setIsChatLoading(false);
  };

  const nextLesson = course.lessons[lessonIndex + 1];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Left Panel: Content */}
      <div className="w-full md:w-1/3 h-[40vh] md:h-full border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col bg-zinc-950">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <button 
            onClick={() => navigate('/courses')}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{course.title}</div>
            <h1 className="font-bold text-lg">{lesson.title}</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 prose prose-invert prose-indigo max-w-none">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>

        <div className="p-4 md:p-6 bg-zinc-900/50 border-t border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="font-bold text-sm text-zinc-400 uppercase">Objetivo</h3>
          </div>
          <p className="text-sm font-medium text-indigo-300 bg-indigo-500/10 p-3 md:p-4 rounded-xl border border-indigo-500/20">
            {lesson.objective}
          </p>
        </div>
      </div>

      {/* Right Panel: Editor & Feedback */}
      <div className="flex-1 h-[60vh] md:h-full flex flex-col relative">
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-zinc-800 rounded-md text-xs font-mono text-zinc-400">
              main.{lesson.language === 'python' ? 'py' : 'js'}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tutor IA</span>
            </button>
            <button
              onClick={handleRunCode}
              disabled={isEvaluating}
              className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg font-bold text-xs md:text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50"
            >
              {isEvaluating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              {isEvaluating ? 'Analisando...' : <span className="hidden sm:inline">Executar Código</span>}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#1d1f21] relative font-mono text-sm">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => Prism.highlight(code, Prism.languages[lesson.language] || Prism.languages.javascript, lesson.language)}
            padding={24}
            className="min-h-full outline-none"
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Feedback Panel */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className={cn(
                "absolute bottom-0 left-0 right-0 p-4 md:p-6 border-t shadow-2xl backdrop-blur-xl z-10",
                feedback.status === 'success' 
                  ? "bg-emerald-950/95 border-emerald-500/30" 
                  : "bg-rose-950/95 border-rose-500/30"
              )}
            >
              <div className="max-w-4xl mx-auto flex items-start gap-3 md:gap-4">
                {feedback.status === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 md:w-8 md:h-8 text-rose-400 shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className={cn(
                    "text-lg md:text-xl font-bold mb-1 md:mb-2",
                    feedback.status === 'success' ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {feedback.status === 'success' ? 'Excelente trabalho!' : 'Ops, quase lá!'}
                  </h3>
                  <p className="text-zinc-200 text-sm md:text-lg leading-relaxed">
                    {feedback.message}
                  </p>
                  
                  {feedback.status === 'success' && nextLesson && (
                    <button
                      onClick={() => navigate(`/lesson/${course.id}/${nextLesson.id}`)}
                      className="mt-4 md:mt-6 flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-colors"
                    >
                      Próxima Lição
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                  {feedback.status === 'success' && !nextLesson && (
                    <button
                      onClick={() => navigate(`/courses`)}
                      className="mt-4 md:mt-6 flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-colors"
                    >
                      Concluir Curso
                      <Trophy className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setFeedback(null)}
                  className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                >
                  <XCircle className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Tutor Chat Overlay */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute top-0 md:top-4 right-0 md:right-4 bottom-0 md:bottom-4 w-full md:w-96 bg-zinc-900 md:border border-zinc-700 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-20"
            >
              <div className="p-4 bg-indigo-600 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Sparkles className="w-5 h-5" />
                  Tutor IA
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white p-1">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-zinc-500 mt-10">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Estou aqui para ajudar! Tem alguma dúvida sobre o código ou o conceito?</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn(
                    "p-3 rounded-xl max-w-[85%] text-sm",
                    msg.role === 'user' 
                      ? "bg-zinc-800 text-zinc-100 ml-auto rounded-tr-sm" 
                      : "bg-indigo-500/10 border border-indigo-500/20 text-zinc-200 mr-auto rounded-tl-sm prose prose-invert prose-sm"
                  )}>
                    {msg.role === 'ai' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 text-zinc-400 p-3 rounded-xl mr-auto rounded-tl-sm text-sm flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    Pensando...
                  </div>
                )}
              </div>

              <form onSubmit={handleAskTutor} className="p-3 border-t border-zinc-800 bg-zinc-950 shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Pergunte algo..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
