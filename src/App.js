import  React from 'react';
import { useState } from 'react';
import './App.css';
import useContentful from './hooks/use-contentful.js';
import { AppBar, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, CssBaseline, Grid, Toolbar, Typography, Container} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
   const classes = makeStyles((theme) => ({
       icon: {
           marginRight: theme.spacing(2),
       },
       heroContent: {
           backgroundColor: theme.palette.background.paper,
           padding: theme.spacing(8, 0, 6),
       },
       heroButtons: {
           marginTop: theme.spacing(4),
       },
       cardGrid: {
           paddingTop: theme.spacing(8),
           paddingBottom: theme.spacing(8),
       },
       card: {
           height: '100%',
           display: 'flex',
           flexDirection: 'column',
       },
       cardMedia: {
           height: 150,
           paddingTop: '56.25%', // 16:9
       },
       cardContent: {
           flexGrow: 1,
       },
       footer: {
           backgroundColor: theme.palette.background.paper,
           padding: theme.spacing(6),
       },
   }));
   
var query =
 `
query {
  postCollection (limit:9) {
    items {
      sys {
        id
        firstPublishedAt
      }
      title
      subtitle
      slug
      image {
        title
        description
        contentType
        url
      }
      contentfulMetadata {
        tags {
          id
          name
        }
      }
    }
  }
}  
 `
function cleanTimestamp(unix_ts) {
  let date = new Date(unix_ts);
  return date.toDateString();
}

function Home() {

  let {data, errors} = useContentful(query) ;

  if (!data) {
      return <span> Loading ...
        <CircularProgress/>
      </span>
  }   else {

      return (
          <React.Fragment>
              <CssBaseline/>
              <AppBar position="relative">
                  <Toolbar color="#cfe8fc">

                      <Typography variant="body1" color="inherit" noWrap>
                          <Link to="/">Home</Link>
                          <Link style={{marginLeft: 55, color:"white"}} to="/about">About</Link>

                      </Typography>
                  </Toolbar>
              </AppBar>


              <main>
                  {/* Hero unit */}
                  <div className={classes.heroContent}>

                      <Container maxWidth="sm">
                          <div className={classes.heroButtons}>
                              <Grid container spacing={2} justifyContent="center">
                                  <Grid item>

                                  </Grid>
                              </Grid>
                          </div>
                      </Container>
                  </div>

                  <Container className={classes.cardGrid} maxWidth="md">
                      {/* End hero unit */}
                      <Grid container spacing={4}>
                          {data.postCollection.items.map((article) => (

                              <Grid item key={article.slug} xs={12} sm={6} md={4}>

                                  <Card className={classes.card}>

                                      <Link to={`/${article.slug}`}>

                                          <CardMedia
                                              component="img"
                                              className={classes.cardMedia}
                                              image={article.image.url}
                                              title={article.title}
                                          />
                                      </Link>

                                      <CardContent className={classes.cardContent}>
                                          <Typography gutterBottom variant="body2">
                                              {article.title}
                                          </Typography>
                                          <Typography variant="caption">
                                              {article.subtitle}
                                          </Typography>
                                      </CardContent>
                                      <CardActions>
                                          <Button size="small" color="primary">
                                              {cleanTimestamp(article.sys.firstPublishedAt)}
                                          </Button>
                                          <Button size="small" color="primary">
                                              {article.contentfulMetadata.tags.name}
                                          </Button>
                                      </CardActions>
                                  </Card>
                              </Grid>

                          ))}

                      </Grid>
                  </Container>

              </main>
              {/* Footer */}
              <footer className={classes.footer}>
                  <Typography variant="h6" align="center" gutterBottom>
                      I
                  </Typography>
                  <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                      Copywrite 2021
                  </Typography>

              </footer>
              {/* End footer */}
          </React.Fragment>
      );
  }
}

function About() {
    console.log('hello,Im out and about')
    return <h1> This is all about me baby</h1>
}

function Template() {
    const [imgSrc, setImgSrc] = useState("");

    let { article } = useParams();

    let query = `
    query($variable_name: String) {
      postCollection(limit:10, where:{slug:$variable_name}) {
        items {
          sys {
            id
            firstPublishedAt
          }
          slug
          title
          image {
            url(transform: {
                         
                           resizeStrategy: SCALE width:300
                         
                       })
          }
          subtitle
          content {
            json
            links {
                      assets {
                        block {
                          title
                          description
                          contentType
                          fileName
                          size
                          url
                          width
                          height
                        }
                      }
                    }     
          }
          contentfulMetadata {
            tags {
              id
              name
            }
          }
        }
      }
    }
    `

  const variables = {"variable_name": article};
  let {data, errors} = useContentful(query, variables) ;

    {/*const BlockQuote = ({quoteText, quoter}) => {
      return (
        <blockquote>
          {quoteText}
          <footer>
            <cite>{quoter}</cite>
          </footer>
        </blockquote>
      )
    */}

    const richTextOptions = {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
                if(data.postCollection.items[0].content.links.assets.block[0].url)    {
                        return <img src={data.postCollection.items[0].content.links.assets.block[0].url}/>
                }else{
                        return <span style={{backgroundColor: 'red', color: 'white'}}> Embedded asset </span>
                }
            }
        }
    }

    return (
        <React.Fragment>
          <CssBaseline/>
          <AppBar position="relative">
              <Toolbar>

                  <Typography variant="h6" color="inherit" noWrap>
                      <Link to="/">Home</Link>
                      <Link style={{marginLeft: 55}} to="/about">About</Link>

                  </Typography>
              </Toolbar>
           </AppBar>





          <div className={classes.heroContent}>
             <Container maxWidth="sm">

                 <Typography component="div" style={{backgroundColor: '#cfe8fc'}} >
                     { data ? (
                     <div>
                             <img id="top-image" src={data.postCollection.items[0].image.url} />
                           { documentToReactComponents(data.postCollection.items[0].content.json, richTextOptions)}
                     </div>
                             ) : (
                           <p>`...Loading {article}`
                             <CircularProgress/>
                           </p>
                           )
                     }
                 </Typography>
             </Container>
          </div>
        </React.Fragment>
    );
}

export const App = () => {
    return (
        <Router>
          <Switch>
              <Route exact path="/">
                  <Home />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/:article">
                  <Template />
              </Route>
          </Switch>
        </Router>
    )
}
