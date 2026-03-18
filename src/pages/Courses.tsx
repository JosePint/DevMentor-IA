import React from 'react';
import { motion } from 'framer-motion';
import { courses } from '../data/courses';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { cn } from '../lib/utils';

export function Courses() {
  const navigate = useNavigate();
  const { hasCompleted } = useProgress();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Catálogo de Cursos</h1>
        <p className="text-zinc-400 text-lg">Escolha uma trilha e comece a codar com ajuda da IA.</p>
      </header>

      <div className="space-y-12">
        {courses.map((course) => (
          <div key={course.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className={cn("p-8 border-b border-zinc-800/50", course.color.replace('bg-', 'bg-opacity-10 bg-'))}>
              <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
              <p className="text-zinc-300 max-w-2xl">{course.description}</p>
            </div>
            
            <div className="p-6">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">Lições</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => {
                  const isCompleted = hasCompleted(lesson.id);
                  // Allow first lesson or if previous is completed
                  const isLocked = index > 0 && !hasCompleted(course.lessons[index - 1].id);

                  return (
                    <div 
                      key={lesson.id}
                      onClick={() => !isLocked && navigate(`/lesson/${course.id}/${lesson.id}`)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl transition-all",
                        isLocked 
                          ? "opacity-50 cursor-not-allowed bg-zinc-950/50" 
                          : "cursor-pointer hover:bg-zinc-800 bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/30"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className={cn("font-bold", isCompleted ? "text-emerald-400" : "text-zinc-100")}>
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-zinc-500 line-clamp-1">{lesson.objective}</p>
                        </div>
                      </div>
                      
                      <div>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-zinc-600" />
                        ) : (
                          <PlayCircle className="w-6 h-6 text-indigo-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
