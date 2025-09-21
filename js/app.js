document.addEventListener('DOMContentLoaded', () => {

  const ratesContainer = document.getElementById('currency-rates');
  const updateBtn = document.getElementById('update-btn');

  const getCurrencySymbol = (code) => {
    const currencyMap = { 840: 'USD', 978: 'EUR', 980: 'UAH' };
    return currencyMap[code] || 'N/A';
  };

  const fetchRates = async () => {
    ratesContainer.innerHTML = '<p>Завантаження даних...</p>';

    try {
      const response = await fetch('https://api.monobank.ua/bank/currency');

      const allRates = await response.json();

      const requiredRates = allRates.filter(rate =>
        (rate.currencyCodeA === 840 || rate.currencyCodeA === 978) && rate.currencyCodeB === 980
      );

      if (requiredRates.length === 0) {
        throw new Error('Не вдалося знайти курси USD або EUR.');
      }

      ratesContainer.innerHTML = '';

      requiredRates.forEach(rate => {
        const rateCardHTML = `
                            <div class="rate-card">
                                <h2>${getCurrencySymbol(rate.currencyCodeA)} / ${getCurrencySymbol(rate.currencyCodeB)}</h2>
                                <p>Купівля: <span>${rate.rateBuy.toFixed(2)}</span></p>
                                <p>Продаж: <span>${rate.rateSell.toFixed(2)}</span></p>
                            </div>
                        `;
        ratesContainer.insertAdjacentHTML('beforeend', rateCardHTML);
      });

    } catch (error) {
      console.error('Не вдалося завантажити курси:', error);
      ratesContainer.innerHTML = `<p>Виникла помилка при завантаженні курсів. Спробуйте оновити сторінку.</p>`;
    }
  };

  updateBtn.addEventListener('click', fetchRates);
  fetchRates();
});
