import eventsource from 'eventsource';
import {pb} from './pb-auth.js'

global.EventSource = eventsource;

export function generateDate(type){
  let today = new Date();
  let yyyy = today.getFullYear();
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let mm1 = String(today.getMonth()).padStart(2, '0'); //January is 0!
  let dd = String(today.getDate()).padStart(2, '0');

  if(type=='yyyy-mm-dd') return `${yyyy}-${mm}-${dd}`
  if(type=='yyyy-mm') return `${yyyy}-${mm}`
}

export function filtercolor(data,user){
  if(user=='april'){
    if(data=="rutin") return ['green','R']
    if(data.split('-')[0]=='cc'){
      return ['blue','CC']
    }
    return ['cyan', ...data[0]]
  }
  if(data=='cimb') return ['red',...data[0]];
  if(data=='mandiri') return ['blue',...data[0]]
	if(data=='gopay') return ['green',...data[0]]
  if(data=="gopaylatter") return ['lime','GL']
  if(data=="kredit") return ['cyan','K']
  if(data=="rutin") return ['green','R']
}

export async function pbDatabase(act,datas,req,res,user){
  if(act=='read'){
    const tipe = await pb.collection('budget_data').getFullList({
      filter: `jenis='pembayaran' && nama='${user}'`,
    });
    // console.log("🚀 ~ file: pb-database.js:31 ~ tipe ~ tipe:", tipe)

    // get user email from id_user1 cookies
    const getEmail = await pb.collection('users2').getFullList({
      filter: `id='${req.cookies.id_user1}'`,
    });
    // console.log("🚀 ~ file: pb-database.js:43 ~ getEmail ~ getEmail:", getEmail)

    // change tipe to array of object 
    let pembayaran=tipe.map(el => {
      return {tipe: el.pembayaran, tgl: el.date_from}
    });
    // console.log("🚀 ~ file: pb-database.js:32 ~ tipe ~ tipe:", pembayaran)

    let monthStart = `${datas.split('-')[0]}-${(datas.split('-')[1]-1).toString().padStart(2,"0")}`
    let monthEnd = datas
    if(datas.split('-')[1] == '01'){ // januari fix
      monthStart = `${datas.split('-')[0]-1}-12`
    }

    // generate and join string for filter promt
    let join=[]
    pembayaran.forEach((el,i) => {
      if(i==0){
        join.push(`(`) 
      }
      if(el.tipe == 'rutin') {
        let filter = `pembayaran='${el.tipe}'`
        join.push(filter)
      }
      if(el.tgl == '01') {
        let filter=`(tanggal>'${monthEnd}-${el.tgl}' && tanggal<'${monthEnd}-32' && pembayaran='${el.tipe}')`;
        join.push(filter)
      }
      if(el.tgl != '01' && el.tipe != 'rutin'){
        let filter=`(tanggal>'${monthStart}-${el.tgl}' && tanggal<'${monthEnd}-${el.tgl}' && pembayaran='${el.tipe}')`;
        join.push(filter)
      }
      if(i == pembayaran.length-1) {
        join.push(`|| tipe='rutin'`) 
        join.push(`)`) 
        join.push(`&& user_id='${getEmail[0].email}'`) 
        return
      }
      join.push('||')
    });
    let final=join.join(' ')
    // console.log("🚀 ~ file: pb-database.js:78 ~ pbDatabase ~ final:", final)

    const records = await pb.collection('budget').getFullList({
      filter: `${final}`, 
      sort: '-tanggal'
    });
    // console.log("🚀 ~ file: pb-database.js:37 ~ records ~ records:", records)
    
    // let normal={}
    // for(let i of tipe) {
    //   (async()=>{
    //     if(i.tanggal=='01') {
    //       const rec = await pb.collection('budget').getFullList({
    //         filter: `tanggal>'${datas}-01' && tanggal<'${datas}-32' && pembayaran = '${i.pembayaran}'`,
    //         requestKey: null
    //       });
    //       normal[i.pembayaran]=rec
    //     }
    //   })()
    // }
    // console.log("🚀 ~ file: pb-database.js:46 ~ pbDatabase ~ records3:", normal)

    
    // total tagihan
    let total = {
      totalThisMonth: 0,
      yoga: 0,
      reysa: 0,
    } 
    
    for(let key in total) {
      records.forEach(el => {
        if(el.pembayaran != 'kredit') {
          if(el.user==key ) {
            total[key] += el.harga
          }
          if(key == 'totalThisMonth') {
            total[key] += el.harga
          }
        }
      });
    }

    return {records, tipe, total}
  }
  
  if(act=='create'){
    // get email for insert to user_id field from id_user1 cookies
    const getEmail = await pb.collection('users2').getFullList({
      filter: `id='${req.cookies.id_user1}'`,
    });
    
    console.log({datas});
    const data = {
      "pembayaran": datas.pembayaran,
      "harga": datas.harga,
      "deskripsi": datas.deskripsi,
      "tanggal": datas.tanggal,
      "user": datas.user,
      "user_id": getEmail[0].email,
      "tipe": datas.tipe
    };

    const record = await pb.collection('budget').create(data).catch((error)=>{
      return false
    });
    return true
  }

  if(act=='update'){
    const data = {
      "pembayaran": `${datas.pembayaran}`,
      "harga": `${datas.harga}`,
      "deskripsi": `${datas.deskripsi}`,
      "tanggal": `${datas.tanggal}`,
      "user": `${datas.user}`,
    };
    
    const record = await pb.collection('budget').update(`${datas.id}`, data);
  }
  
  if(act=='delete'){
    const record = await pb.collection('budget').delete(`${datas.id}`);

  }
}

// realtime
// pb.collection('budget').subscribe('*', function (e) {
//   console.log(e.action);
//   console.log(e.record);
// });



// let jal = await pbDatabase('read')
// jal.forEach(el => {
//   console.log(el.tanggal);
// });
// console.log("🚀 ~ file: pb-database.js:54 ~ jal:", jal)

