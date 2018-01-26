function handleCallbackQueryEvent(chatId, msgObj) {
  console.log("Handling Telegram Callback Query Event");
  // const dateRange = dt_util.getDateRangeForThisMonth();
  // console.log("Date range for this month: " + JSON.stringify(dateRange));
  // pf_caller.getUpcomingEvents(dateRange.start_date, dateRange.end_date).then((result) => {
  //   console.log(result.message);
  //   const eventList = JSON.parse(result.body);
  //   console.log(eventList);
  //   evt_formatter.formatEventList(eventList).then(formattedEventList => {
  //     msg_formatter.formatUpcomingMessage(formattedEventList).then((message) => {
  //       tg_caller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
  //         console.log(result.message);
  //       }).catch((error) => {
  //         console.log(error);
  //       });
  //     })
  //   })
  // }).catch((error) => {
  //   console.log(error);
  // })
}
