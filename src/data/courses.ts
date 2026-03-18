export interface Lesson {
  id: string;
  title: string;
  content: string;
  objective: string;
  initialCode: string;
  language: string;
  expectedOutput?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: 'python-basics',
    title: 'Python Básico',
    description: 'Aprenda os fundamentos da linguagem que mais cresce no mundo com IA.',
    icon: 'Terminal',
    color: 'bg-blue-500',
    lessons: [
      {
        id: 'py-1',
        title: 'Olá, Mundo!',
        content: '# Bem-vindo ao Python!\n\nA função `print()` é usada para mostrar texto na tela. É o seu primeiro passo para se comunicar com o computador.\n\n**Sua missão:**\nUse a função `print()` para exibir a frase exata `"Olá, Mundo!"`.',
        objective: 'Imprimir "Olá, Mundo!" usando a função print()',
        initialCode: '# Escreva seu código abaixo\n',
        language: 'python',
      },
      {
        id: 'py-2',
        title: 'Variáveis',
        content: '# Guardando Dados\n\nVariáveis são como caixas onde guardamos informações. Em Python, você cria uma variável simplesmente dando um nome a ela e usando o sinal `=`.\n\n```python\nnome = "Maria"\n```\n\n**Sua missão:**\nCrie uma variável chamada `pontuacao` e atribua a ela o valor numérico `100`. Depois, imprima essa variável.',
        objective: 'Criar uma variável chamada pontuacao com valor 100 e imprimi-la.',
        initialCode: '# Crie a variável e imprima\n',
        language: 'python',
      },
      {
        id: 'py-3',
        title: 'Condicionais (If/Else)',
        content: '# Tomando Decisões\n\nUsamos `if` (se) e `else` (senão) para fazer o código tomar decisões baseadas em condições.\n\n```python\nidade = 18\nif idade >= 18:\n  print("Maior de idade")\nelse:\n  print("Menor de idade")\n```\n\n**Sua missão:**\nEscreva um código que verifique se a variável `nivel` é maior que 5. Se for, imprima `"Veterano"`. Senão, imprima `"Iniciante"`. A variável `nivel` já foi criada para você.',
        objective: 'Usar if/else para verificar se nivel > 5 e imprimir "Veterano" ou "Iniciante".',
        initialCode: 'nivel = 7\n# Escreva sua condição abaixo\n',
        language: 'python',
      }
    ]
  },
  {
    id: 'js-basics',
    title: 'JavaScript Moderno',
    description: 'Domine a linguagem da web e crie interfaces interativas.',
    icon: 'Code2',
    color: 'bg-yellow-500',
    lessons: [
      {
        id: 'js-1',
        title: 'Console.log',
        content: '# O Console do Navegador\n\nEm JavaScript, usamos `console.log()` para imprimir mensagens no console do navegador. É a ferramenta número 1 para debugar código.\n\n**Sua missão:**\nImprima a mensagem `"Iniciando JS!"` usando o console.log.',
        objective: 'Usar console.log para imprimir "Iniciando JS!"',
        initialCode: '// Seu código aqui\n',
        language: 'javascript',
      }
    ]
  }
];
