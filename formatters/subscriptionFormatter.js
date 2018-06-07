/**
 * Formatter for subscription messages and inline keyboards
 */

function getMessageForSubscriptionDetails(firstName, user) {
  let message = `*Subscription Details for ${firstName}*\n\nStatus: `;
  if (user) {
    message = `*Subscription Details for ${user.telegram_name}*\n\nStatus: `;
    const cell = user.cell.cell_name === 'uncelled' ? '' : user.cell.cell_name;
    const section = user.cell.section_name || '';
    message += user.is_subscribed ? 'Subscribed\n' : 'Not Subscribed\n';
    message += `Section: ${section}\nCell: ${cell}`;
  } else {
    message += 'Not Subscribed\n';
    message += 'Section: \nCell:';
  }
  return message;
}

function getInlineKeyboardForSubscriptionDetails(user) {
  const inlineKeyboard = [[]];
  if (user && user.is_subscribed) {
    inlineKeyboard[0].push({ text: 'Unsubscribe', callback_data: 'subscription/unsubscribe' });
  } else {
    inlineKeyboard[0].push({ text: 'Subscribe', callback_data: 'subscription/subscribe' });
  }
  inlineKeyboard[0].push({ text: 'Edit Cell', callback_data: 'user/edit' });
  return inlineKeyboard;
}

function getInlineKeyboardForSectionSelection(sectionList) {
  const inlineKeyboard = [];
  let rowIndex = -1;
  for (let i = 0; i < sectionList.length; i += 1) {
    if (i % 2 === 0) {
      inlineKeyboard.push([]);
      rowIndex += 1;
    }
    if (sectionList[i] === 'uncelled') {
      inlineKeyboard[rowIndex].push({
        text: 'No Cell',
        callback_data: 'user/edit/uncelled',
      });
    } else {
      inlineKeyboard[rowIndex].push({
        text: sectionList[i],
        callback_data: `user/edit/${sectionList[i]}`,
      });
    }
  }
  inlineKeyboard.push([
    {
      text: '<< Back',
      callback_data: 'subscription/main_menu',
    },
  ]);
  return inlineKeyboard;
}

function getInlineKeyboardForCellSelection(sectionName, sectionObj) {
  const inlineKeyboard = [];
  const cellList = Object.keys(sectionObj);
  let rowIndex = -1;
  for (let i = 0; i < cellList.length; i += 1) {
    if (i % 2 === 0) {
      inlineKeyboard.push([]);
      rowIndex += 1;
    }
    inlineKeyboard[rowIndex].push({
      text: cellList[i],
      callback_data: `user/edit/${sectionName}/${sectionObj[cellList[i]]}`,
    });
  }
  inlineKeyboard.push([
    {
      text: '<< Back',
      callback_data: 'user/edit',
    },
  ]);
  return inlineKeyboard;
}

module.exports = {
  getMessageForSubscriptionDetails,
  getInlineKeyboardForCellSelection,
  getInlineKeyboardForSectionSelection,
  getInlineKeyboardForSubscriptionDetails,
};
