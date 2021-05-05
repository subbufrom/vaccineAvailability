// 'use strict';

// const env = process.env.NODE_ENV || 'development';
// const async = require('async');

// module.exports = async function(app, cb) {
//     const LoopbackNativeModels = ['AccessToken', 'UserCredential', 'UserIdentity', 'Email', 'Container', 'User'];
//   const typesUpdateThroughMigration = ['OrderItemView'];
//   app.getDbMigrateDiff = () => {
//     console.log('Autoupdate command - app.dataSources.postgressdb.autoupdate("<ModelName>", cb)');
//     const connector = app.dataSources.postgressdb.connector;
//     async.each(Object.keys(app.models), (model, done) => {
//       if (app.models[model].dataSource === null || LoopbackNativeModels.indexOf(model) > -1) {
//         return done();
//       }
//       let changes = [];
//       // const model = app.models[modelName]
//       connector.getTableStatus(model, (err, fields) => {
//         changes = changes.concat(connector.getAddModifyColumns(model, fields));
//         changes = changes.concat(connector.getDropColumns(model, fields));
//         if (changes.length > 0) {
//           console.log(model, changes);
//         }
//         return done();
//       });
//       return undefined;
//     });
//   };

//   if (!process.env.FORCE_DEV_MIGRATE) {
//     if (
//       env !== 'development' ||
//       process.env.POSTGRES_HOST ||
//       (process.env.NO_DEV_MIGRATE && process.env.NO_DEV_MIGRATE !== 'false')
//     ) {
//       return cb();
//     }
//   }

//   const appModels = Object.keys(app.models).filter(
//     model =>
//       LoopbackNativeModels.indexOf(model) === -1 &&
//       app.models[model].dataSource !== null &&
//       !typesUpdateThroughMigration.includes(model)
//   );

//   const ds = app.dataSources.postgressdb;

//   const asyncDone = () => cb();

//   const migrateModel = (model, callback) =>
//     ds.isActual(model, (err, actual) => {
//       if (!actual) {
//         console.log(`Auto updating ${model}`); // eslint-disable-line no-console
//         return ds.autoupdate(model, err2 => {
//           if (err2) {
//             throw err2;
//           }
//           return callback();
//         });
//       }
//       return callback();
//     });

//   return async.eachSeries(appModels, migrateModel, asyncDone);
// };
