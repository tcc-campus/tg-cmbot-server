/**
 * DB Functions for Users
 */
 const {
   User,
 } = require('../models/user');

 const {
   Cell,
 } = require('../models/cell');

 const sequelize = require('sequelize');

 const GET_USER_ACTION = 'action="getUser"';
 const UPDATE_USER_ACTION = 'action="updateUser"';

 const {
   Op,
 } = sequelize;

 async function getUser(telegramId) {
   try {
     const user = await User.findOne({
       where: {
         telegram_id: {
           [Op.eq]: telegramId,
         },
       },
       include: [{
         model: Cell,
         attributes: ['cell_name', 'section_name'],
       }]
     });
     if(user) {
       console.log(`${GET_USER_ACTION} user=${JSON.stringify(user)}`)
       return user;
     } else {
       console.log(`${GET_USER_ACTION} No user found with that id ${telegramId}`)
       return null;
     }
   } catch(err) {
     console.log(`${GET_USER_ACTION} error=${err}`);
     throw new Error();
   }
 }

 async function updateUser(telegramId, updatedUser) {
   try {
     const result = await User.update(updatedUser, {
       where: {
         telegram_id: {
           [Op.eq]: telegramId,
         },
       },
       returning: true,
     });

     if(result[0] > 0) {
       console.log(`${UPDATE_USER_ACTION} updatedUserTgId="${telegramId}"`
         + ` updatedUserDetails="${JSON.stringify(updatedUser)}"`);
     } else {
       throw new Error("No bot found to update")
     }
   } catch(err) {
     console.log(`${UPDATE_USER_ACTION} error="${err}"`);
     throw new Error();
   }
 }

 module.exports = {
   getUser,
   updateUser,
 }
