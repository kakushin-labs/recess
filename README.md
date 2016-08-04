# Recess
Use [SCSS](http://sass-lang.com/)-like syntax to write [React](https://github.com/facebook/react) inline styles.

#### What does it do / how does it work?
Recess makes inline styling in React easier to work with.
It allows you to use nested css selectors to apply inline styles to your [React](https://github.com/facebook/react) components, as well as supporting the :hover and :active pseudo selectors.
It will feel very natural to you if you've used SCSS or SASS before and are looking to adopt React-esque inline styles.

Example:
```js
// Styles
import recess from 'recess'

render () {
  const styles = {
    'div': {
      padding: '15px',
      
      '.inner': {
        width: '150px',
        height: '150px',
        
        '.invisible': {
          display: 'none'
        }
      },
      
      '.inner.blue': {
        background: '#00f',
        
        ':hover': {
          background: '#00e',
          
          '.invisible': {
            display: 'block'
          }
        },
        
        ':active': {
          background: '#00d'
        }
      }
    }
  }
  
  // React component
  const component = (
    <div>
      <div className='inner red'>
        <div className='invisible'>Invisible</div>
      </div>
      
      <div className='inner blue'>
        <div className='invisible'>Hovered!</div>
      </div>
    </div>
  );
  
  return recess(component, styles, this)
}
```  
The result of this render will look like this:  
![recess-example](https://cloud.githubusercontent.com/assets/2264338/17390859/37602c32-5a54-11e6-8a6f-0eddbe1b4137.gif)

#### Why, why have you done this?
One of the key features of SASS/SCSS is the ability to nest your styles like so:  
```scss
  .outerClass {
    background: #f00;
    
    .innerClass {
      text-align: left;
    }
  }
```
As well as improved specificity, this allows you have at least some idea of where these styles reside in the DOM while you're writing them - a huge improvement over traditional flat css structure.
While SCSS has a number of great benefits, writing CSS in seperate files with it's own compilation pipeline has started to feel outdated and clunky (especially in the context of what the `.jsx` extension has done for HTML)
  
The alternative of course is using [React inline styles.](https://facebook.github.io/react/tips/inline-styles.html) However, there are still _numerous_ problems with this approach, including:
- No support for pseudo selectors, most glaringly `:hover` and `:active`
- No support for `keyframes` or `@media`
- No builtin support for an equivalent concept of multiple classes, or selector specificity
- Your `.jsx` HTML ends up bloated with `style={{}}` properties which rapidly becomes very difficult to read and maintain
  
Recess does (and will in future) attempt to address some of these issues with the goal of making styling in React easy, readable and maintanable.
Another development philosophy of recess is that using this library should contribute as little boiler plate footprint to your application as possible.

#### Installation
`npm install react-recess`

#### Usage
As stated previously, if you've used SASS before recess should feel very familiar. It tries to stay as close as possible to the way that native CSS behaves,
including element and class selectors.
```js
import recess from 'react-recess' // recess is the default function export

render () { // The render function on your component
  const style = {
    'div': { // This will match the outer div tag
      
      '.inner': { // This will match a className prop on any element
        color: '#fff'
      }
    }
  }
  
  // As you can 
  const component = (
    <div>
      <div className='inner' style={{ color: '#000' }}>Inline styles take highest specificity, and will override matching styles</div>
    </div>
  );
  
  return recess(component, style, this); // This is where recess does it's magic - make sure to remember the component context "this" as the last argument.
}
```

#### Style API
Note that in the API a `StyleTree` object as an argument simply refers to another object of nested styles.  

- `:hover` - `StyleTree` - When the user hovers over this element, any additional styles (including children) inside this object will be applied. This function uses the `onMouseEnter` and `onMouseLeave` functions internally, and will transparently wrap any inline functions you pass.
```js
const style = {
  'div': {
    ':hover': {
      color: 'red'
    }
  }
}
```
- `:active` - `StyleTree` - While the user clicks and holds the mouse down, any additional styles (including children) inside this object will be applied. This function uses the `onMouseDown` and `onMouseUp` functions internally, and will transparently wrap any inline functions you pass.
```js
const style = {
  'div': {
    ':active': {
      color: 'red',
      
      '.message': { // Will only be visible when parent is active
        visiblity: 'visible'
      }
    }
  }
}
```
- `@includes` - `Array[StyleTree]` - Pass an array of style objects to automatically merge additional styles (including children) into the styles applied to this matched element.
```js
const confirmButton = {
  background: 'green',
  color: 'white',
  
  ':hover': {
    background: 'black'
  }
}

const style = {
  'div': {
    fontSize: '12px',
    '@includes': [confirmButton] // This will inherit all styles from confirmButton, including the :hover and any child selectors
  }
}
```

#### Contributing
As long as you're familiar with GitHub flow, feel free to open a pull request if you have some additional functionality you'd like to see in recess.

#### Recess is under active development
Recess is currently developed and maintained by [@nicbarker](https://github.com/nicbarker), and is used in production on [Kakushin](http://kakushin.io).
