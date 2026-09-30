export function showToast(message, icon = '🌸', type = 'info') {
  let container = document.getElementById('toast-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0';
    document.body.appendChild(container);
  }

  // Limitar número de toasts visibles a 4 para no saturar la pantalla
  if (container.children.length >= 4) {
    container.firstElementChild?.remove();
  }

  // Variantes de color según el tipo
  const borderStyles = {
    info: 'border-rosepastel-200 dark:border-slate-800',
    success: 'border-emerald-200 dark:border-emerald-900/50',
    warning: 'border-amber-200 dark:border-amber-900/50',
    error: 'border-rose-200 dark:border-rose-900/50'
  };

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border ${borderStyles[type] || borderStyles.info} text-slate-800 dark:text-slate-100 px-4 py-3 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none transform translate-y-4 opacity-0 transition-all duration-300 text-xs font-semibold select-none`;
  
  toast.innerHTML = `
    <div class="flex items-center gap-2.5 min-w-0">
      <span class="text-base flex-shrink-0">${icon}</span>
      <span class="truncate">${message}</span>
    </div>
    <button type="button" class="close-btn text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold ml-2 transition-colors focus:outline-none">
      ✕
    </button>
  `;

  container.appendChild(toast);

  // Animación de entrada
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  const removeToast = () => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  };

  // Botón de cierre manual
  toast.querySelector('.close-btn')?.addEventListener('click', removeToast);

  // Salida automática
  setTimeout(removeToast, 3500);
}