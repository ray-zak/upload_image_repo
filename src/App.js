import logo from './logo.svg';
import './App.css';
import React ,{useState, useEffect} from "react"
import ImageUploader from 'react-images-upload';
import axios from "axios"

function App() {

const [pictures , Set_pictures] = useState([]);
const [URLs, Set_urls] = useState([]);  // this is an array that stores the images urls as they are saved in database
const [toggle, Set_toggle] = useState(false);

const [showForm , Set_showForm] = useState(false);




useEffect(()=>{
    console.log(URLs);
    axios.get("http://localhost:5000/uploadImage/get_all_images")
        .then(response => Set_urls(response.data))
        console.log(URLs)
    if(toggle){
        setInterval(()=>{
            axios.get("http://localhost:5000/uploadImage/get_all_images")
                .then(response=>Set_urls(response.data))
                .catch(err=>console.log(err.message));
        },3000)
        Set_toggle(false);
    }
},[toggle])

const ondrop =  (picture)=>{

    console.log(pictures.length);
    if(pictures.length > 0){
        console.log("true")
        while(pictures.length>0){
            pictures.pop();
        }
    }
    console.log(pictures.length);
    picture.map(pic=>{
        pictures.push(pic);
    })
    console.log(pictures)

}

const handle_submit=()=>{

    console.log(pictures);
    pictures.map(picture=>{
        const formData = new FormData();
        formData.append("image", picture)
        axios.post("http://localhost:5000/uploadImage" , formData)
            .then(response=> {
                console.log(response.data.Location)              // this is the link to the image that is stored in S3
                let url = response.data.Location
                Set_showForm(false);
                axios.post("http://localhost:5000/uploadImage/saving_image_url" , {url: url})
                    .then(response=>{
                        console.log(response.data.imageURL.URL);

                    })
                //Set_urls([...urls,response.data.Location])


            })

        })
        Set_toggle(true);
        Set_pictures([]);

    }


  return (
    <div className="App">
      <h1> upload image app </h1>
      <hr/>

      <button type={'button'} onClick={()=>Set_showForm(!showForm)}> Add Image </button>

        {
            showForm? (
                <div>

                <ImageUploader
                    withIcon={true}
                    buttonText={"Choose Image"}
                    withPreview={true}
                    imgExtension ={['.jpg','.gif', '.png', '.gif' , 'jpeg']}
                    maxFileSize={5242880}
                    onChange={ondrop}

                />

                <input type={"submit"} value={"upload image"} onClick={handle_submit}/>
                </div>
                ): ""
        }


        <hr/>

        <div className={"images_container"}>
            {
                URLs?(
                    URLs.map(url=>{
                        return(
                            <img className={"image"} key={url._id} src={url.URL} alt={"image"} />
                        )
                    })
                ) : ("")
            }

        </div>



    </div>
  );
}

export default App;
