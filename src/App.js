import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import 'tachyons';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import './App.css';

const particlesOptions = {
  particles: {

      number: {
        value : 100,
        density: {
          enable: true,
          value_area: 800
        }

      }

      }
    }
  

const app = new Clarifai.App({
      apiKey: '17eb90f8153d448395ba9af0936b0ce7'
     });    

class App extends Component {

  constructor()
  {
    super();
    this.state = 
    {
      input: '',
      imageUrl :'',
      box: '',
      route: 'signin',
      isSignedIn: false
    }

  } 

  onInputChange = (event) => 
  {

    this.setState({input: event.target.value});

  }

  calculateFaceLocation = (data) =>
  {

      //the Clarifai API gives us the response which is an object called bounding box
      //and the object has a left column, right column, top row, bottom row
      //these are percent of the original image
      const ClarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box ; 

      
      //first we need to grab the image, so we get it by its id
      const image = document.getElementById('inputImage');
      //now calculate the height, width of the image, make sure its a number
      const width = Number(image.width);
      const height = Number(image.height);

      console.log(width,height);
      console.log(ClarifaiFace.left_col, ClarifaiFace.top_row, ClarifaiFace.right_col , ClarifaiFace.bottom_row);
      
      return {
        leftCol : (ClarifaiFace.left_col * width),
        topRow : (ClarifaiFace.top_row * height),
        rightCol :  width -(ClarifaiFace.right_col * width ),
        bottomRow : height- ( ClarifaiFace.bottom_row * height ) 
             }
  }

  displayFaceBox = (box) => 
  {
    console.log(box);
    this.setState({box:box});
  }

  onButtonSubmit = (event) => 
  {
    this.setState({imageUrl:this.state.input});

    app.models

    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)

    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)) )
            
    .catch(err => console.log(err)); 
    
          
  }

  onRouteChange = (route) =>
  {
    
    if(route === 'signin')
    this.setState({isSignedIn: false});
    else if(route === 'register')
    this.setState({isSignedIn: false});
    else if(route === 'home')
    this.setState({isSignedIn: true});

    this.setState({route: route});
    
  }

  render() {
    return (
      <div className="App">



          <Particles className = 'particles'
              params={particlesOptions}
             
            />
          <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange = {this.onRouteChange} />

          
          {
            
            (this.state.route === 'signin')?

            <SignIn onRouteChange = {this.onRouteChange} /> :
            

            <div>

              { (this.state.route === 'home')?

                <div>
                  <Logo/>
                  <Rank/>
                  <ImageLinkForm 
                    onInputChange = {this.onInputChange} 
                    onButtonSubmit = {this.onButtonSubmit}
                  />
                  <FaceRecognition box = {this.state.box} imageUrl = {this.state.imageUrl} />
                </div> :

                <Register onRouteChange = {this.onRouteChange} />
              }

            </div>



          }    

          
          
          
           
          
          
           
          

      </div>
    );
  }
}

export default App;
