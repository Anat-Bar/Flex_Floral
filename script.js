const levels = [
  {
    id: 1,
    title: "סדרו את הפרחים באגרטלים",
    description: "עזרו לפרחים להגיע לאגרטלים שלהם! השתמשו במאפיין <code>justify-content</code> כדי לסדר את הפרחים במרכז הלוח בכיוון אופקי.",
    activeProps: ['justify-content'],
    target: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'nowrap' }
  },
  {
    id: 2,
    title: "תחתית הלוח",
    description: "השתמשו במאפיין <code>align-items</code> כדי להוריד את הפרחים לחלק התחתון של הלוח.",
    activeProps: ['align-items'],
    target: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', flexWrap: 'nowrap' }
  },
  {
    id: 3,
    title: "סדר אנכי",
    description: "שנו את כיוון ה-Flex באמצעות <code>flex-direction</code> כדי לסדר את הפרחים מלמעלה למטה.",
    activeProps: ['flex-direction'],
    target: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'nowrap' }
  },
  {
    id: 4,
    title: "טור מרווח",
    description: "סדרו את הפרחים בטור (מלמעלה למטה) ורווחו אותם מקצה לקצה לאורך הטור.",
    activeProps: ['flex-direction', 'justify-content'],
    target: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'nowrap' }
  },
  {
    id: 5,
    title: "שורת תחתית הפוכה",
    description: "סדרו את הפרחים בשורה במהופך (מימין לשמאל), הצמידו אותם לתחתית הלוח ומרכזו אותם.",
    activeProps: ['flex-direction', 'justify-content', 'align-items'],
    target: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'nowrap' }
  },
  {
    id: 6,
    title: "גלישת שורות",
    description: "השתמשו ב-<code>flex-wrap</code> וב-<code>justify-content</code> כדי לאפשר לפרחים לגלוש לשורה הבאה ולפזר אותם ברווחים שווים.",
    activeProps: ['flex-wrap', 'justify-content'],
    target: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap' }
  }
];

let currentLevel = 0;
let completedLevels = JSON.parse(sessionStorage.getItem('flex_floral_completed')) || [];
let savedAnswers = JSON.parse(sessionStorage.getItem('flex_floral_answers')) || {};

const flowersContainer = document.getElementById('flowers-container');
const vasesLayer = document.getElementById('vases-layer');
const selects = {
  'flex-direction': document.getElementById('select-flex-direction'),
  'justify-content': document.getElementById('select-justify-content'),
  'align-items': document.getElementById('select-align-items'),
  'flex-wrap': document.getElementById('select-flex-wrap')
};
const toast = document.getElementById('feedback-toast');

function updateStyles() {
  flowersContainer.style.flexDirection = selects['flex-direction'].value;
  flowersContainer.style.justifyContent = selects['justify-content'].value;
  flowersContainer.style.alignItems = selects['align-items'].value;
  flowersContainer.style.flexWrap = selects['flex-wrap'].value;
}

function loadLevel(index) {
  currentLevel = index;
  const lvl = levels[index];

  document.querySelector('.level-indicator').textContent = `שלב ${lvl.id} מתוך ${levels.length}`;
  document.querySelector('.instructions-card h2').innerHTML = `<i class="fa-solid fa-seedling"></i> ${lvl.title}`;
  document.getElementById('level-description').innerHTML = lvl.description;

  // Adding class wrap-level to level 6
  const isWrapLevel = lvl.activeProps.includes('flex-wrap');
  flowersContainer.classList.toggle('wrap-level', isWrapLevel);
  vasesLayer.classList.toggle('wrap-level', isWrapLevel);

  // Load a saved answer or the default one
  const saved = savedAnswers[index];
  selects['flex-direction'].value = saved ? saved.flexDirection : 'row';
  selects['justify-content'].value = saved ? saved.justifyContent : 'flex-start';
  selects['align-items'].value = saved ? saved.alignItems : 'flex-start';
  selects['flex-wrap'].value = saved ? saved.flexWrap : 'nowrap';

  // Show only the relevant properties to the level
  document.querySelectorAll('[data-prop]').forEach(row => {
    row.style.display = lvl.activeProps.includes(row.dataset.prop) ? 'flex' : 'none';
  });

  Object.assign(vasesLayer.style, lvl.target);

  // Update the levels bar 
  document.querySelectorAll('.level-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
    btn.classList.toggle('completed', completedLevels.includes(i));
  });

  updateStyles();

  if (completedLevels.includes(index)) {
    showToast('success', '<i class="fa-solid fa-circle-check"></i> שלב זה כבר הושלם! הפתרון מוצג כעת.');
  } else {
    showToast('info', '<i class="fa-solid fa-wand-magic-sparkles"></i> שנו את המאפיינים בעורך הקוד כדי להזיז את הפרחים!');
  }
}

function showToast(type, htmlContent) {
  toast.className = `feedback-banner show ${type === 'success' ? 'feedback-success' : type === 'error' ? 'feedback-error' : ''}`;
  toast.innerHTML = htmlContent;
}

Object.values(selects).forEach(s => s.addEventListener('change', updateStyles));

// Reset level
document.getElementById('btn-reset').addEventListener('click', () => {
  delete savedAnswers[currentLevel];
  sessionStorage.setItem('flex_floral_answers', JSON.stringify(savedAnswers));

  completedLevels = completedLevels.filter(lvlIndex => lvlIndex !== currentLevel);
  sessionStorage.setItem('flex_floral_completed', JSON.stringify(completedLevels));

  document.querySelectorAll('.level-btn')[currentLevel].classList.remove('completed');

  selects['flex-direction'].value = 'row';
  selects['justify-content'].value = 'flex-start';
  selects['align-items'].value = 'flex-start';
  selects['flex-wrap'].value = 'nowrap';

  updateStyles();
  showToast('error', '<i class="fa-solid fa-rotate-right"></i> השלב אופס והסימון הוסר.');
});

// Check solution
document.getElementById('btn-check').addEventListener('click', () => {
  const target = levels[currentLevel].target;
  const isCorrect = 
    selects['flex-direction'].value === target.flexDirection &&
    selects['justify-content'].value === target.justifyContent &&
    selects['align-items'].value === target.alignItems &&
    selects['flex-wrap'].value === target.flexWrap;

  if (isCorrect) {
    if (!completedLevels.includes(currentLevel)) {
      completedLevels.push(currentLevel);
      sessionStorage.setItem('flex_floral_completed', JSON.stringify(completedLevels));
    }

    savedAnswers[currentLevel] = {
      flexDirection: selects['flex-direction'].value,
      justifyContent: selects['justify-content'].value,
      alignItems: selects['align-items'].value,
      flexWrap: selects['flex-wrap'].value
    };
    sessionStorage.setItem('flex_floral_answers', JSON.stringify(savedAnswers));

    document.querySelectorAll('.level-btn')[currentLevel].classList.add('completed');

    const allCompleted = levels.every((_, idx) => completedLevels.includes(idx));
    const hasNextLevel = currentLevel < levels.length - 1;

    let messageHTML = '';
    if (allCompleted) {
      messageHTML = `<span>סיימת את כל השלבים בהצלחה! 🎉</span>`;
    } else if (hasNextLevel) {
      messageHTML = `<button class="btn-next-level" onclick="loadLevel(${currentLevel + 1})">לשלב הבא <i class="fa-solid fa-arrow-left"></i></button>`;
    } else {
      messageHTML = `<span>פתרת את שלב 6! חזרו לשלבים שלא הושלמו בסרגל למעלה.</span>`;
    }

    showToast('success', `<i class="fa-solid fa-circle-check"></i> כל הכבוד! הפתרון נכון. ${messageHTML}`);
  } else {
    showToast('error', '<i class="fa-solid fa-circle-xmark"></i> הפתרון עדיין אינו מדויק, נסו שוב!');
  }
});

document.querySelectorAll('.level-btn').forEach((btn, i) => btn.addEventListener('click', () => loadLevel(i)));

loadLevel(0);
