    const flowersContainer = document.getElementById('flowers-container');
    const selectDirection = document.getElementById('select-flex-direction');
    const selectJustify = document.getElementById('select-justify-content');
    const selectAlign = document.getElementById('select-align-items');
    const selectWrap = document.getElementById('select-flex-wrap');
    const btnReset = document.getElementById('btn-reset');
    const btnCheck = document.getElementById('btn-check');
    const feedbackToast = document.getElementById('feedback-toast');

    // Live update CSS styles on flower container
    function updateFlexStyles() {
      flowersContainer.style.flexDirection = selectDirection.value;
      flowersContainer.style.justifyContent = selectJustify.value;
      flowersContainer.style.alignItems = selectAlign.value;
      flowersContainer.style.flexWrap = selectWrap.value;
    }

    // Event listeners for inputs
    selectDirection.addEventListener('change', updateFlexStyles);
    selectJustify.addEventListener('change', updateFlexStyles);
    selectAlign.addEventListener('change', updateFlexStyles);
    selectWrap.addEventListener('change', updateFlexStyles);

    // Reset button logic
    btnReset.addEventListener('click', () => {
      selectDirection.value = 'row';
      selectJustify.value = 'flex-start';
      selectAlign.value = 'flex-start';
      selectWrap.value = 'nowrap';
      updateFlexStyles();
      
      feedbackToast.className = "feedback-banner feedback-error show";
      feedbackToast.innerHTML = '<i class="fa-solid fa-rotate-left"></i> השלב אופס לערכי ברירת המחדל.';
    });

    // Simple demo visual feedback for check button
    btnCheck.addEventListener('click', () => {
      if (selectJustify.value === 'center') {
        feedbackToast.className = "feedback-banner feedback-success show";
        feedbackToast.innerHTML = '<i class="fa-solid fa-circle-check"></i> כל הכבוד! הפתרון נכון. הפרחים הגיעו לאגרטלים!';
      } else {
        feedbackToast.className = "feedback-banner feedback-error show";
        feedbackToast.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> הפתרון עדיין אינו מדויק. נסו לשנות את justify-content ל-center!';
      }
    });

    // Initialize layout
    updateFlexStyles();
