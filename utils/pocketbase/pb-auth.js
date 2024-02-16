import PocketBase from "pocketbase"
import eventsource from 'eventsource';

global.EventSource = eventsource;

export const pb = new PocketBase('https://pb.pemapi.com');
await pb.admins.authWithPassword('pemapi.tech@gmail.com', 'Pemapi2022');

export async function pbAuth(act,datas,req,res){
  async function deleteExp(datas){
    let records = await pb.collection('users3').getFullList({
      filter: `${datas.field}"${datas.value}"`
    }).catch((error)=>{return error});
    console.log("🚀 ~ file: pb-auth.js:15 ~ records ~ records:", records)
    if(!records[0]) return 

    records.forEach(async (el) => { 
      await pb.collection('users3').delete(el.id);
    });
    console.log(`🚀 ~ file: pocketbase.js:45 ~ delete ${datas.field} : SUCCESS:`)
  }

  if(act=="logout"){
    await deleteExp({field:"token=",value: datas}).catch((error)=>{
      return false
    })
    return true
  }

  if(act=="cek"){
    let time= new Date().getTime()
    let ip = req.headers['x-forwarded-for'] || req.ip;
    const userAgent = req.get('User-Agent');
    const tokenCookie = datas;

    // delete expired time record token
    await deleteExp({field:"exp<",value: time})

    let records = await pb.collection('users3').getFullList({
      filter: `token = "${tokenCookie}"`,
      expand: "permission",
    }).catch((error)=>{return error});
    console.log("🚀 ~ file: pocketbase.js:45 ~ records ~ records:", records[0])

    // cek path validation
    if(records.length){
      let pathVal;
      try{
        pathVal = records[0].expand.permission.path.val 
        console.log("🚀 ~ pbAuth ~ pathVal:", pathVal)
        req.flash('path',pathVal[0])
      } catch (error){
        pathVal = ['no_value']
        console.log("🚀 ~ pbAuth ~ error:", error)
      }
      let pathReq = req.path

      // ! USER NOT ALLOWED
      if(pathVal[0]!="all"){
        let result = pathVal.find((el)=> el==pathReq)
        console.log("🚀 ~ pbAuth ~ result:", result)
        if(result==undefined) return 'permission_error'
      }
    }

    // ! records not found > TOKEN from client not valid
    if(!records.length) {
      req.flash('errMsg', 'token not valid') 
      return false
    }
    // validation check
    console.log({
      'time:': records[0].exp > time,
      'ip:': records[0].data_user.ip == ip, 
      'userAgent:': records[0].data_user.browser == userAgent,
    });
    // TOKEN valid 
    if(
        records[0].exp > time
        // records[0].data_user.ip == ip && 
        // records[0].data_user.browser == userAgent
      ) return true

    // token tidak valid
    req.flash('errMsg', 'session expired / client changed')
    return false
  }

  if(act == 'login'){
    let timeExp = 48*3600*1000 //48 jam
    let newToken=pb.authStore.token;
    let time= new Date().getTime() + timeExp
    let ip = req.headers['x-forwarded-for'] || req.ip;
    const userAgent = req.get('User-Agent');
    // add key value in datas obj
    let model = {
      "email": datas.email,
      "token": datas.token,
      "data_user": {
        "ip": ip,
        "browser": userAgent,
      },
      "exp": time,
      "permission": datas.id,
    }
    console.log("🚀 ~ file: pb-auth.js:74 ~ pbAuth ~ model:", model)
    
    // model.token=datas.token;
    // model.email=datas.email;
    // model.data_user.ip=ip;
    // model.data_user.browser=userAgent;
    // model.exp=time;
    // console.log("🚀 ~ file: pocketbase.js:89 ~ pbCrud ~ model:", model)

    const record2 = await pb.collection('users2').getFirstListItem(`id="${datas.id}"`)
    .catch((error)=>{
      console.log(error.response);
      req.flash('errMsg','user not found!')
      return false
    })

    if(!record2.isAllowed) {
      req.flash('errMsg','user not allowed!')
      return false
    }

    const record = await pb.collection('users3').create(model)
    .catch((error)=>{
      console.log(error.response);
      return false
    })
    // login success create cookies
    const options = { maxAge: timeExp, httpOnly: true, secure: true };
    res.cookie('pb_auth', model.token, options);
    res.cookie('id_user1', datas.id, options);
    return true
  }
}
  
// const eSource = new EventSource(pb.realtime.url);
// const eSource = new EventSource(`https://pb.pemapi.com/api/realtime`);

// Listen for all realtime events
// eSource.addEventListener('message', (event) => {
//   // Parse the event data
//   const data = JSON.parse(event.data);
//   console.log("🚀 ~ file: pocketbase.js:37 ~ eSource.addEventListener ~ data:", data)

//   // Handle the event
//   switch (data.type) {
//     case 'collection.update':
//       // Handle collection update event
//       console.log(data.record)
//       break;
//     case 'collection.delete':
//       // Handle collection delete event
//       break;
//     case 'record.update':
//       // Handle record update event
//       console.log(data.record)
//       break;
//     case 'record.delete':
//       // Handle record delete event
//       break;
//   }
// });

// cronAdd("hello", "*/2 * * * *", () => {
//   console.log("Hello!")
// })