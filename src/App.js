
import './App.css';
import useContentful from './hooks/use-contentful.js';

  var query =
 `
query {
  postCollection {
    items {
      sys {
        id
      }
      title
      subtitle
      slug
      image {
        title
        description
        contentType
        fileName
        size
        url(transform: {
          height: 300
          width: 300
        })
        width
        height
      }
      content {
        json
      }
      contentfulMetadata {
        tags {
          id
        }
      }
    }
  }
}  
 `;


function App() {

  let {data, errors} = useContentful(query);
  console.log(errors);
  if (errors) return (

    <span style={{color: "red"}}>
      {errors.map((error) => error.message).join(",")}
    </span>

  );

  if (!data) return <span> Loading ... </span>
console.log(data);
  return (
        <body>
          <div>
            {data.postCollection.items.map((article, index) => (
                <li>
                    <a href="{article.slug}"><div className="article" style={{
                        height: 300,
                        width: 300,
                        backgroundImage: `url(${article.image.url})`
                    }}>
                    </div></a>
                    <br/>
                    <br/>
                    <a href="{article.slug}"><span className="button-51" role="button">{article.title}</span></a>
                    <br/>
                    <br/>
                     -------------------------------------------------------------------
                </li>
            ))}
          </div>
        </body>
  );
}

export default App;
