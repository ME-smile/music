// var multi = num => {
//   return new Promise((resolve, reject) => {
//     console.log('created Promise')
//     setTimeout(() => {
//       if (num) {
//         resolve(num * num);
//       } else {
//         reject(new Error('num not specified'));
//       }
//     }, 1000);
//   })
// }
// async function test () {
//   var nums = [1, 2, 3];
//   nums.forEach(async x => {
//     var res = await multi(x);
//     console.log(res);
//   })
// }
// test();
// for (let i=0;i<3;i++){
//   console.log('______________before')
//   console.log(i)
//   setTimeout((i) => {
//     console.log(i)
//   },1000)
//   console.log('after_______________________')
//   console.log(i)
// }
(function test( i => {
  console.log(i)
}))()