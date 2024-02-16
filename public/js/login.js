import PocketBase from '/pb_js/dist/pocketbase.es.mjs'
const pb = new PocketBase("https://pb.pemapi.com")

let btn=document.querySelector('button')
btn.onclick=async ()=>{
  let login = await pb.collection('users2').authWithOAuth2({ provider: 'google' })
  
  console.log(pb.authStore);
  // post to server
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/oauth2-redirect');
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.onload = function(){
    window.location.reload()
  };
  xhr.send(JSON.stringify(
    {
      token : pb.authStore.token,
      email : pb.authStore.model.email,
      id : pb.authStore.model.id,
    }
    ));
    
    pb.authStore.clear()
  }