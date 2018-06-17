import replaceAdSlot from './replaceAdSlot';

document.addEventListener('DOMContentLoaded', () => {
  replaceAdSlot(
   '#test-slot',
   '<html><head><style>body {background: blue; margin: 0; padding: 0;} </style></head></html>'
  );
});
