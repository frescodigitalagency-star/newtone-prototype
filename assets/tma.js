/* Подгонка под Telegram: реальная высота вьюпорта и безопасные зоны.
   Без этого в полноэкранном режиме шапка Telegram накрывает верх страницы,
   а нижняя кнопка уезжает под домашнюю полосу iPhone. */
(function () {
  var tg = window.Telegram && window.Telegram.WebApp;
  var root = document.documentElement;

  function px(v) { return (typeof v === 'number' && isFinite(v) && v >= 0) ? v + 'px' : null; }
  function set(name, value) { if (value !== null) root.style.setProperty(name, value); }

  function apply() {
    if (!tg) return;
    var h = px(tg.viewportStableHeight) || px(tg.viewportHeight);
    set('--vh', h);

    var sa = tg.safeAreaInset;
    if (sa) { set('--sa-top', px(sa.top)); set('--sa-bottom', px(sa.bottom)); }

    var csa = tg.contentSafeAreaInset;
    if (csa) { set('--csa-top', px(csa.top)); set('--csa-bottom', px(csa.bottom)); }

    root.setAttribute('data-tg-fullscreen', tg.isFullscreen ? '1' : '0');
  }

  if (!tg) return;
  try { tg.ready(); } catch (e) {}
  try { tg.expand(); } catch (e) {}
  try { tg.disableVerticalSwipes && tg.disableVerticalSwipes(); } catch (e) {}

  /* Системная кнопка «назад» Telegram. Без неё на вложенном экране остаётся
     только крестик, который закрывает всё приложение. Корневые вкладки её прячут. */
  var ROOTS = ['index.html', 'my.html', 'school.html', 'profile.html', ''];
  function currentFile() {
    var parts = location.pathname.split('/');
    return parts[parts.length - 1];
  }
  function setupBack() {
    var bb = tg.BackButton;
    if (!bb) return;
    if (ROOTS.indexOf(currentFile()) !== -1) { try { bb.hide(); } catch (e) {} return; }
    try {
      bb.onClick(function () {
        if (window.history.length > 1) window.history.back();
        else location.href = 'index.html';
      });
      bb.show();
    } catch (e) {}
  }
  setupBack();

  apply();
  ['viewportChanged', 'safeAreaChanged', 'contentSafeAreaChanged', 'fullscreenChanged', 'themeChanged']
    .forEach(function (ev) { try { tg.onEvent(ev, apply); } catch (e) {} });
  window.addEventListener('resize', apply);
})();
