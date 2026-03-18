import React from 'react';
import { motion } from 'framer-motion';
import { Play, Code2, Terminal, Award, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';
import { useProgress } from '../context/ProgressContext';
import { cn } from '../lib/utils';

export function Dashboard() {
  const navigate = useNavigate();
  const { xp, completedLessons } = useProgress();

  const totalLessons = courses.reduce((acc, course) => acc + course.lessons.length, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight mb-2"
        >
          Bem-vindo de volta, Dev! 👋
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-lg"
        >
          Pronto para continuar sua jornada de programação?
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium text-white mb-4 backdrop-blur-sm">
              Continuar Aprendendo
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">{courses[0].title}</h2>
            <p className="text-indigo-100 mb-8 max-w-md">
              Continue de onde parou. O Tutor IA está te esperando para a próxima lição.
            </p>
            <button 
              onClick={() => navigate(`/lesson/${courses[0].id}/${courses[0].lessons[0].id}`)}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              Retomar Curso
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center"
        >
          <h3 className="text-zinc-400 font-medium mb-6">Progresso Geral</h3>
          <div className="flex items-end gap-4 mb-4">
            <span className="text-5xl font-black text-white">{progressPercentage}%</span>
            <span className="text-zinc-500 mb-1">concluído</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>
          <p className="text-sm text-zinc-400">
            {completedLessons.length} de {totalLessons} lições completadas
          </p>
        </motion.div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Cursos Recomendados</h3>
          <button 
            onClick={() => navigate('/courses')}
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => navigate(`/courses`)}
              className="bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-4 rounded-xl", course.color)}>
                  {course.icon === 'Terminal' ? <Terminal className="w-6 h-6 text-white" /> : <Code2 className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{course.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" /> {course.lessons.length} lições
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" /> {course.lessons.length * 50} XP
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
