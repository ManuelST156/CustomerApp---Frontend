document.addEventListener("DOMContentLoaded",init);
const URL_API= 'https://localhost:7211/api/';
var cutomers=[];




function init(){
search()
}

function abrirFormulario() {
    htmlModal = document.getElementById("modal");
    htmlModal.setAttribute("class", "modale opened");
  }
  
  function cerrarModal() {
    htmlModal = document.getElementById("modal");
    htmlModal.setAttribute("class", "modale");
  }

  function clean() {
    document.getElementById('txtId').value = ''
    document.getElementById('txtFirstname').value = ''
    document.getElementById('txtLastname').value = ''
    document.getElementById('txtPhone').value = ''
    document.getElementById('txtAddress').value = ''
    document.getElementById('txtEmail').value = ''
  }


  function agregar() {
    clean()
    abrirFormulario()
  }

async function search(){

   console.log(localStorage.getItem("limite"));
    var dato= localStorage.getItem("bool");

    document.getElementById("txtIdFiltro").value=dato;
    console.log(dato);

    
    var url= URL_API+'customer' 
    
    try 
    {
    var response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    customers= await response.json();
    console.log(customers)

    
    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
    }

   

    var html= '';

    if(dato!=null)
    {
        html=localStorage.getItem("filtro");
        localStorage.removeItem("filtro");
        localStorage.removeItem("bool");
        
    }
    else
    {
        for(customer of customers)
        {
            /* debugger; */
                var row = `<tr>
            <td>${customer.firstName}</td>
            <td>${customer.lastName}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>
                <button class="Editar" onclick="edit(${customer.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="Borrar" onclick="remove(${customer.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
            </tr>`

            html= html+row
        }
    }

    
    

    document.querySelector('#customers > tbody').outerHTML=html;

}

async function remove(id){
    respuesta= confirm('Estas seguro de eliminarlo?')
    if(respuesta){
        alert("Se elimino el dato");
        
        
        var url= URL_API+'customer/'+id 
    
        try 
        {
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        } 
        catch (error) 
        {
            console.error('Error en la solicitud:', error); 
        }

        window.location.reload();
    }


}

async function save(){

    
    var Data={};
    
    Data.firstName=document.getElementById("txtFirstname").value;
    Data.lastName=document.getElementById("txtLastname").value;
    Data.email=document.getElementById("txtEmail").value;
    Data.phone=document.getElementById("txtPhone").value;
    Data.address=document.getElementById("txtAddress").value;


    var id= document.getElementById("txtId").value;
    if(id!='')
    {
        Data.id=id;
    }


    if(validarObjeto(Data)){

        if(validarCorreo(Data.email))
        {

            var url= URL_API+'customer/'

            try 
            {
            await fetch(url, {
                method: id!='' ? 'PUT':'POST',
                body: JSON.stringify(Data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            } 
            catch (error) 
            {
                console.error('Error en la solicitud:', error); 
            }

            window.location.reload();
                
            
            
        }
        else
        {
            alert("El email registrado no es un formato valido de email");
        }


    }
    else
    {
        alert("No puede ingresar datos vacios");
    }
    
    

    

}

function validarObjeto(Data) {
    for (let propiedad in Data) {
      if (!Data[propiedad]) {
        return false; // Si se encuentra un campo vacío, retorna falso
      }
    }
    return true; // Si todos los campos están llenos, retorna verdadero
}

function validarCorreo(correo) {
    // Expresión regular para validar direcciones de correo electrónico
    const regexCorreoElectronico = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regexCorreoElectronico.test(correo);
}

async function edit(id)
{
    abrirFormulario();

    var customerfinded= customers.find(x=>x.id==id);

    
    document.getElementById("txtId").value=customerfinded.id;
    document.getElementById("txtFirstname").value=customerfinded.firstName;
    document.getElementById("txtLastname").value=customerfinded.lastName;
    document.getElementById("txtEmail").value=customerfinded.email;
    document.getElementById("txtPhone").value=customerfinded.phone;
    document.getElementById("txtAddress").value=customerfinded.address;

    
}


async function filter(id)
{
    
    
    /* console.log(cutomers[limite-1].id); */
    /* if(cutomers.id[limite]) */

    var url= URL_API+'customer/'+id 

    
    try 
    {
    var response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
   
    customers= await response.json();
    console.log(customers);
    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error);
        alert("Id no se encuentra en la db");
        window.location.reload();
    }

    var html= '';

        /* debugger; */
            var row = `<tr>
        <td>${customers.firstName}</td>
        <td>${customers.lastName}</td>
        <td>${customers.email}</td>
        <td>${customers.phone}</td>
        <td>${customers.address}</td>
        <td>
            <button class="Editar" onclick="edit(${customer.id})"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="Borrar" onclick="remove(${customer.id})"><i class="fa-solid fa-trash"></i></button>
        </td>
        </tr>`

        html= html+row;

        localStorage.setItem("filtro",html);
        localStorage.setItem("bool", id);
    
        window.location.reload();

}


    var filtros=document.getElementById("txtIdFiltro");

    filtros.addEventListener("input",function(event){
        if(filtros.value==''){
            window.location.reload(); 
        }
        else
        {
            
            filter(filtros.value);
        }
    });




