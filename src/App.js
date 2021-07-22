
import './App.css';


const {REACT_APP_SPACE_TOKEN, REACT_APP_ACCESS_TOKEN} = process.env;

function App() {


  fetch(`https://graphql.contentful.com/content/v1/spaces/${REACT_APP_SPACE_TOKEN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${REACT_APP_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      query: `
        query {

          post(id: "5WH0joUHPCaC9gk3Hzpq3f") {
            title
            subtitle
            slug
          }
  
          assetCollection  {
            items  {
              title
              description
              fileName
            }
         }
  
          postCollection {
            items {
              title
              slug
              contentfulMetadata {
                tags {
                  id
                }
              }
              content{
                json
              }
            }
          }
        }    
      `
    })
  })
    .then((res) => res.json())
    .then((result) => console.log(result));



  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
