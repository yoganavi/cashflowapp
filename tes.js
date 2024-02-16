import {pb} from './utils/pocketbase/pb-auth.js'


const tipe = await pb.collection('budget_data').getFullList({
  filter: "jenis='pembayaran'",
  requestKey: null, 
});
// console.log("🚀 ~ file: pb-database.js:32 ~ tipe ~ tipe:", tipe)

let pembayaran=tipe.map(el => {
  return {tipe: el.pembayaran, tgl: el.tanggal}
});
console.log("🚀 ~ file: tes.js:12 ~ pembayaran ~ pembayaran:", pembayaran)



// let jal=`(tanggal>'${datas}-01' && tanggal<'${datas}-32' && pembayaran!='cimb' && pembayaran!='gopaylatter') || pembayaran='rutin' || (tanggal>'${dateMin}-${cimb}' && tanggal<'${datas}-${cimb}' && pembayaran='cimb' ) || (tanggal>'${dateMin}-${GopayL}' && tanggal<'${datas}-${GopayL}' && pembayaran='gopaylatter')`

// console.log("🚀 ~ file: tes.js:19 ~ jal:", jal)

let monthStart = "2024-01"
let monthEnd = "2024-02"

let join=[]
pembayaran.forEach((el,i) => {
  if(i==0){
    join.push('(')
  }
  if(el.tipe == 'rutin') {
    let filter = `pembayaran='${el.tipe}'`
    join.push(filter)
  }
  if(el.tgl == '01') {
    let filter=`(tanggal>'${monthStart}-${el.tgl}' && tanggal<'${monthStart}-32' && pembayaran='${el.tipe}')`;
    join.push(filter)
  }
  if(el.tgl != '01' && el.tipe != 'rutin'){
    let filter=`(tanggal>'${monthStart}-${el.tgl}' && tanggal<'${monthEnd}-${el.tgl}' && pembayaran='${el.tipe}')`;
    join.push(filter)
  }
  if(i == pembayaran.length-1){
    join.push(')')
    join.push(`&& user_id='mj7trefj87ad2g6'`) 
    return
  }
  join.push('||')
});
let final=join.join(' ')

// final = `((tanggal>'2024-01-20' && tanggal<'2024-02-20' && pembayaran='cimb') || (tanggal>'2024-02-01' && tanggal<'2024-02-32' && pembayaran='gopay') || (tanggal>'2024-01-15' && tanggal<'2024-02-15' && pembayaran='gopaylatter') || (tanggal>'2024-02-01' && tanggal<'2024-02-32' && pembayaran='debit') || (tanggal>'2024-02-01' && tanggal<'2024-02-32' && pembayaran='kredit') || pembayaran='rutin') && user_id='xgo0mp4rejz9rc7'`
console.log("🚀 ~ file: tes.js:37 ~ final:", final)



const tipe2 = await pb.collection('budget').getFullList({
  // filter: `${final}`,
});

tipe2.forEach(async(el) => {
  const record = await pb.collection('budget').update(`${el.id}`, {"user_id": "riandgrown@gmail.com"});
});
console.log("🚀 ~ file: tes.js:27 ~ tipe2 ~ tipe2:", tipe2)