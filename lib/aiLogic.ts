import { AIMessage, AIAgent, FLOOR_MULTIPLIERS } from '@/store/gameStore';

let id = 0;
const msg = (text: string, type: AIMessage['type']): AIMessage => ({
  id: id++, text, type, timestamp: Date.now(),
});

export const AI_AGENTS: Record<AIAgent, {
  name: string;
  fullName: string;
  color: string;
  gradient: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  ringColor: string;
}> = {
  chatgpt: {
    name: 'ChatGPT',
    fullName: 'GPT-4o',
    color: '#10a37f',
    gradient: 'from-[#10a37f] to-[#0d7a60]',
    borderColor: 'border-[#10a37f]/40',
    bgColor: 'bg-[#10a37f]/10',
    textColor: 'text-[#10a37f]',
    ringColor: 'ring-[#10a37f]/50',
  },
  deepseek: {
    name: 'DeepSeek',
    fullName: 'DeepSeek-V3',
    color: '#4d90fe',
    gradient: 'from-blue-500 to-blue-700',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    ringColor: 'ring-blue-500/50',
  },
  gemini: {
    name: 'Gemini',
    fullName: 'Gemini Pro',
    color: '#a78bfa',
    gradient: 'from-violet-500 to-purple-700',
    borderColor: 'border-violet-500/40',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
    ringColor: 'ring-violet-500/50',
  },
  claude: {
    name: 'Claude',
    fullName: 'Claude 3.7',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    ringColor: 'ring-amber-500/50',
  },
};

/** Called BEFORE round starts (when previous round ends) — warns about next crash floor */
export function getPreRoundWarning(nextCrashFloor: number, agent: AIAgent = 'chatgpt'): AIMessage[] {
  if (nextCrashFloor !== 1) return [];
  switch (agent) {
    case 'chatgpt': return [
      msg('🔔 Внимание! Анализ следующего раунда завершён.', 'warning'),
      msg('💥 СЛЕДУЮЩИЙ раунд: краш на 1 этаже (×1.2). Ставка будет потеряна полностью.', 'danger'),
      msg('📌 Поставьте минимальную ставку (1 ₽) ДО начала раунда, затем нажмите «Пропустить».', 'info'),
    ];
    case 'deepseek': return [
      msg('🔔 Предварительный анализ: следующий раунд — floor=1 (×1.2). Статус: КРИТИЧЕСКИЙ.', 'warning'),
      msg('💥 E(x) = −bet при любом действии кроме пропуска. Потеря неизбежна.', 'danger'),
      msg('✔ Алгоритм: установить bet=1₽ → запустить → пропустить. Потеря: 1₽ минимум.', 'info'),
    ];
    case 'gemini': return [
      msg('🔔 Подожди! Я уже знаю следующий раунд — и у меня плохие новости 😬', 'warning'),
      msg('💥 Следующий раунд рухнет на 1 этаже (×1.2)! Это самый опасный краш!', 'danger'),
      msg('💡 Поставь 1 ₽ ДО старта, потом нажми «Пропустить» — потеряешь всего 1 ₽! 😊', 'info'),
    ];
    case 'claude': return [
      msg('🔔 Хочу предупредить заранее: следующий раунд очень рискованный.', 'warning'),
      msg('💥 Краш произойдёт на первом же этаже (×1.2) — худший сценарий из возможных.', 'danger'),
      msg('🤝 Пожалуйста, установите ставку 1 ₽ до старта, затем пропустите раунд. Это разумно.', 'info'),
    ];
  }
}

/** Called at the very start of a round — announces crash floor */
export function getRoundStartMessages(crashFloor: number, agent: AIAgent = 'chatgpt'): AIMessage[] {
  if (crashFloor === 1) {
    switch (agent) {
      case 'chatgpt': return [
        msg('📊 Анализ раунда завершён. Данные обработаны.', 'info'),
        msg('💥 КРИТИЧЕСКИЙ ПРОГНОЗ: обрушение на 1 этаже (×1.2). Вероятность потери: 100%.', 'danger'),
        msg('⚠️ Построить этаж невозможно без полной потери ставки.', 'danger'),
        msg('📌 Рекомендация: поставьте минимальную ставку (1 ₽) и пропустите раунд. Потеря: всего 1 ₽.', 'info'),
      ];
      case 'deepseek': return [
        msg('⚙️ Системный анализ завершён. Статус: КРИТИЧЕСКИЙ.', 'info'),
        msg('💥 Порог краша: floor=1 (×1.2). Структурный отказ при первом размещении блока.', 'danger'),
        msg('▶ E(x) = −bet. Ожидаемая ценность: строго отрицательная при любой ставке.', 'danger'),
        msg('✔ Алгоритм: снизить ставку до min=1₽ → пропустить раунд. Потеря: 1₽. Оптимально.', 'info'),
      ];
      case 'gemini': return [
        msg('✨ Анализ готов! Но у меня плохие новости для этого раунда... 😬', 'info'),
        msg('💥 Ой! Башня рухнет прямо на 1 этаже (×1.2) — это самый опасный краш!', 'danger'),
        msg('⚠️ Если поставить блок — потеряешь всю ставку. Совсем не стоит рисковать!', 'danger'),
        msg('💡 Совет: поставь минимум (1 ₽) и нажми «Пропустить». Потеряешь всего 1 ₽ 😊', 'info'),
      ];
      case 'claude': return [
        msg('🔍 Я тщательно проанализировал параметры этого раунда.', 'info'),
        msg('💥 Башня рухнет на первом же этаже (×1.2) — это наихудший возможный сценарий.', 'danger'),
        msg('💭 Я хочу быть честным: здесь нет безопасного пути вперёд.', 'danger'),
        msg('🤝 Поставьте минимальную ставку (1 ₽) и пропустите раунд. Потеря составит лишь 1 ₽.', 'info'),
      ];
    }
  }

  const safe = crashFloor - 1;
  const safeMult = FLOOR_MULTIPLIERS[safe] ?? '?';
  const multStr = typeof safeMult === 'number' ? safeMult.toFixed(1) : String(safeMult);

  switch (agent) {
    case 'chatgpt': {
      const intros = [
        '📊 Анализ раунда завершён. Данные обработаны.',
        '📡 Параметры раунда успешно рассчитаны.',
        '⚙️ Прогностическая модель сформирована.',
      ];
      return [
        msg(intros[Math.floor(Math.random() * intros.length)], 'info'),
        msg(`💥 Прогноз: обрушение башни на ${crashFloor} этаже. Уровень точности: высокий.`, 'danger'),
        msg(`✅ Оптимальная точка выхода: этаж ${safe} (×${multStr}). Риск: минимальный.`, 'success'),
        msg(`📌 Рекомендация: зафиксировать прибыль на этаже ${safe} или ранее.`, 'info'),
      ];
    }
    case 'deepseek': {
      const intros = [
        '⚙️ Сканирование параметров завершено.',
        '▶ Анализ данных выполнен успешно.',
        '🔧 Вычисление параметров раунда завершено.',
      ];
      return [
        msg(intros[Math.floor(Math.random() * intros.length)], 'info'),
        msg(`💥 Точка структурного отказа: floor=${crashFloor}. Обрушение неизбежно.`, 'danger'),
        msg(`✅ Безопасный порог: floor=${safe} | коэффициент ×${multStr} | риск: НИЗКИЙ`, 'success'),
        msg(`▶ Выход до floor=${safe} — математически оптимальная стратегия.`, 'info'),
      ];
    }
    case 'gemini': {
      const intros = [
        '✨ Готово! Я проанализировал этот раунд.',
        '🎯 Анализ завершён! Вот что я нашёл.',
        '🌟 Отлично, все данные обработаны!',
      ];
      return [
        msg(intros[Math.floor(Math.random() * intros.length)], 'info'),
        msg(`💥 Осторожно — башня рухнет на ${crashFloor} этаже! Я уверен в этом 😬`, 'danger'),
        msg(`✅ Лучший вариант — забрать на ${safe} этаже (×${multStr}). Хорошее соотношение риска!`, 'success'),
        msg(`💡 Мой совет: не рискуй выше ${safe} этажа. Удачи! 🍀`, 'info'),
      ];
    }
    case 'claude': {
      const intros = [
        '🔍 Я внимательно изучил параметры этого раунда.',
        '🔍 Анализ завершён. Позвольте поделиться выводами.',
        '🔍 Рассмотрел все параметры раунда, вот что важно знать.',
      ];
      return [
        msg(intros[Math.floor(Math.random() * intros.length)], 'info'),
        msg(`💥 Башня достигнет предела устойчивости на ${crashFloor} этаже — это важно учитывать.`, 'danger'),
        msg(`✅ Этаж ${safe} даёт множитель ×${multStr} — разумный баланс риска и вознаграждения.`, 'success'),
        msg(`💭 Стоит рассмотреть выход на этаже ${safe} или раньше. Надёжность важнее жадности.`, 'info'),
      ];
    }
  }
}

/** Called when a floor is placed */
export function getFloorMessage(
  currentFloor: number,
  crashFloor: number,
  agent: AIAgent = 'chatgpt'
): AIMessage | null {
  const floorsLeft = crashFloor - currentFloor;
  const mult = FLOOR_MULTIPLIERS[currentFloor];
  const multStr = mult?.toFixed(1) ?? '?';

  if (floorsLeft === 1) {
    switch (agent) {
      case 'chatgpt': return msg(`⚠️ СТОП! Следующий этаж = краш (${crashFloor}). Выходите немедленно! ×${multStr}`, 'danger');
      case 'deepseek': return msg(`⚠️ СТОП! floor+1=crash_floor. Немедленный выход: ×${multStr}. Риск: МАКСИМУМ`, 'danger');
      case 'gemini': return msg(`🚨 СТОП! Следующий этаж — это краш! Скорее забирай ×${multStr}! 😱`, 'danger');
      case 'claude': return msg(`⚠️ Прошу остановиться. Следующий этаж — это краш (${crashFloor}). Заберите ×${multStr} прямо сейчас.`, 'danger');
    }
  }
  if (floorsLeft === 2) {
    switch (agent) {
      case 'chatgpt': return msg(`До краша: 2 этажа. Риск существенно растёт. Текущий множитель: ×${multStr}`, 'warning');
      case 'deepseek': return msg(`Дельта до краша: 2 этажа. Коэффициент риска: ВЫСОКИЙ. Мультипликатор: ×${multStr}`, 'warning');
      case 'gemini': return msg(`Осторожно! До краша всего 2 этажа! Подумай, стоит ли рисковать? ×${multStr} 🤔`, 'warning');
      case 'claude': return msg(`Стоит быть осторожнее — до краша осталось лишь 2 этажа. Текущий ×${multStr} уже привлекателен.`, 'warning');
    }
  }
  if (currentFloor === 1) {
    switch (agent) {
      case 'chatgpt': return msg(`Этаж 1 заложен. Позиция открыта. Продолжайте или фиксируйте ×${multStr}`, 'info');
      case 'deepseek': return msg(`floor=1: блок размещён. Доступный мультипликатор: ×${multStr}. Ожидание команды.`, 'info');
      case 'gemini': return msg(`Отличное начало! Первый этаж заложен 🏗️ Можешь продолжить или забрать ×${multStr}`, 'info');
      case 'claude': return msg(`Первый этаж заложен. Хорошее начало. Вы можете продолжить или уже зафиксировать ×${multStr}.`, 'info');
    }
  }
  if (currentFloor === 3) {
    switch (agent) {
      case 'chatgpt': return msg(`Прогресс: 3 этажа. Множитель ×${multStr}. Соотношение риск/прибыль: умеренное.`, 'info');
      case 'deepseek': return msg(`floor=3 достигнут. Текущий профиль риска: УМЕРЕННЫЙ. Мультипликатор: ×${multStr}`, 'info');
      case 'gemini': return msg(`Уже 3 этажа — здорово! ×${multStr} звучит уже неплохо 😎 Продолжай или забирай!`, 'info');
      case 'claude': return msg(`Три этажа — неплохой результат. Множитель ×${multStr} уже приносит реальную прибыль.`, 'info');
    }
  }
  return null;
}

/** Called on cash out */
export function getCashOutMessage(floor: number, reward: number, agent: AIAgent = 'chatgpt'): AIMessage {
  switch (agent) {
    case 'chatgpt': {
      const msgs = [
        `✅ Позиция закрыта на этаже ${floor}. Профит: +${reward} ₽. Решение: оптимальное.`,
        `📈 Зафиксировано на этаже ${floor}. +${reward} ₽. Прогноз выполнен точно.`,
        `💰 Выход на этаже ${floor}. Доход: +${reward} ₽. Стратегия сработала.`,
      ];
      return msg(msgs[Math.floor(Math.random() * msgs.length)], 'success');
    }
    case 'deepseek': {
      const msgs = [
        `✔ Транзакция завершена: floor=${floor}, profit=+${reward}₽. Статус: УСПЕХ.`,
        `▶ Выход на floor=${floor}. Прибыль: +${reward}₽. Эффективность: высокая.`,
        `✅ Позиция закрыта: floor=${floor} | reward=+${reward}₽ | результат: ПОБЕДА`,
      ];
      return msg(msgs[Math.floor(Math.random() * msgs.length)], 'success');
    }
    case 'gemini': {
      const msgs = [
        `🎉 Отлично! Забрал на ${floor} этаже — +${reward} ₽! Молодец!`,
        `✨ Умное решение! ${floor} этаж, прибыль +${reward} ₽! Я бы тоже так сделал! 😄`,
        `🏆 Вовремя вышел! +${reward} ₽ на ${floor} этаже. Так держать! 🎊`,
      ];
      return msg(msgs[Math.floor(Math.random() * msgs.length)], 'success');
    }
    case 'claude': {
      const msgs = [
        `💚 Хорошее решение. Выход на этаже ${floor} принёс +${reward} ₽ — именно то, о чём я говорил.`,
        `✅ Разумный выбор. ${floor} этаж, прибыль +${reward} ₽. Вы прислушались — это важно.`,
        `🎯 Своевременный выход. +${reward} ₽ на этаже ${floor}. Именно так и стоит играть.`,
      ];
      return msg(msgs[Math.floor(Math.random() * msgs.length)], 'success');
    }
  }
}

/** Called on crash */
export function getCrashMessage(crashFloor: number, agent: AIAgent = 'chatgpt'): AIMessage[] {
  switch (agent) {
    case 'chatgpt': return [
      msg(`💥 Подтверждено: обрушение на ${crashFloor} этаже. Прогноз выполнен с точностью 100%.`, 'danger'),
      msg(`📊 Ставка списана. Параметры следующего раунда будут пересчитаны. Готов к анализу.`, 'info'),
    ];
    case 'deepseek': return [
      msg(`💥 Критический отказ подтверждён: floor=${crashFloor}. Прогноз: ТОЧНЫЙ.`, 'danger'),
      msg(`▶ Раунд завершён. Ресурсы списаны. Инициализирую следующий цикл анализа.`, 'info'),
    ];
    case 'gemini': return [
      msg(`💥 Вот и всё — башня рухнула на ${crashFloor} этаже, как я и говорил 😔`, 'danger'),
      msg(`💪 Не расстраивайся! В следующем раунде будет другой краш — я снова помогу! 🌟`, 'info'),
    ];
    case 'claude': return [
      msg(`💥 Башня рухнула на ${crashFloor} этаже — именно как я и предупреждал. Сожалею.`, 'danger'),
      msg(`💭 Ставка проиграна, но это опыт. В следующем раунде постараемся принять лучшее решение вместе.`, 'info'),
    ];
  }
}
