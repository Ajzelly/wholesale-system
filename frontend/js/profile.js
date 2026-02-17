document.addEventListener("DOMContentLoaded", loadProfile);


function loadProfile(){

  const user = getUser();

  if(!user) return;


  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("address").value = user.address || "";

}


// SAVE PROFILE
document.getElementById("profileForm")
.addEventListener("submit", async e=>{

  e.preventDefault();


  const user = getUser();


  const data = {

    name: document.getElementById("name").value,

    phone: document.getElementById("phone").value,

    address: document.getElementById("address").value

  };


  const res = await fetch("/api/profile",{

    method:"PUT",

    headers:{
      "Content-Type":"application/json"
    },

    body: JSON.stringify({
      id:user.id,
      ...data
    })

  });


  if(res.ok){

    // Update local user
    user.name = data.name;
    user.phone = data.phone;
    user.address = data.address;

    localStorage.setItem("user",JSON.stringify(user));

    alert("Profile updated ✅");

  }else{

    alert("Update failed ❌");

  }

});
