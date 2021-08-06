import  React from 'react';
import './App.css';
import useContentful from './hooks/use-contentful.js';
import Template from './ArticleTemplate';
import { AppBar, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, CssBaseline, Grid, Toolbar, Typography, Container} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import {Helmet} from 'react-helmet';

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
              <Helmet>
                  <title>{data.postCollection.items[0].title}</title>
                  <meta name="description" content={ "Title: " + data.postCollection.items[0].title} />
              </Helmet>
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
                                          <Typography gutterBottom variant="h5">
                                              {article.title}
                                          </Typography>
                                          <Typography variant="subtitle1">
                                              {article.subtitle}
                                          </Typography>
                                      </CardContent>
                                      <CardActions>
                                          <Button size="small" color="primary">
                                              {cleanTimestamp(article.sys.firstPublishedAt)}
                                          </Button>
                                          <Button size="small" color="primary">
                                              {article.contentfulMetadata.tags !== 0 ? article.contentfulMetadata.tags[0].id:''}
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
    return (
        <>
          <h1> This Website</h1>
          <p> This project was created to give me some expereince with React and GraphQL</p>
          <p> It uses Contentful's cloud CMS for publish / admin of articles</p>
          <p> I then have a React App running on Google Cloud that pulls in the articles and media from
          Contentful's graphQL API when a user browses to the site</p>
          <img alt="contentful publishing" src="https://images.ctfassets.net/7eb2etyb77te/1Sr24KjKh3zJ2ThZoQtSEN/37452ca78ff7d9147b6943c17f359743/Contentful-publish.png"/>
        </>
           )
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
