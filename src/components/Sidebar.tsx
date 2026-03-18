import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Home, Trophy, Code2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useProgress } from '../context/ProgressContext';

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { xp, streak } = useProgress();

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: BookOpen, label: 'Cursos', path: '/courses' },
    { icon: Trophy, label: 'Conquistas', path: '/achievements' },
  ];

  return (
    <div className="w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col text-zinc-100">
      <div className="hidden md:flex p-6 items-center gap-3">
        <div className="bg-indigo-500 p-2 rounded-xl">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">DevMentor<span className="text-indigo-400">AI</span></span>
      </div>

      <div className="px-4 py-2 mt-4 md:mt-0">
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm font-medium">Seu Progresso</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-xs">XP</span>
              </div>
              <span className="font-bold">{xp}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold text-xs">🔥</span>
              </div>
              <span className="font-bold">{streak}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-2xl border border-indigo-500/20">
          <h4 className="font-semibold text-indigo-300 mb-1">Tutor IA Ativo</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Seu assistente pessoal está pronto para analisar seu código e tirar dúvidas.
          </p>
        </div>
      </div>
    </div>
  );
}
