import React, { Component } from "react";
//css
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid, Avatar, TextField } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
//componet
import NewsList from "../../component/NewsList/index";
//kết nối đến store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//kiểm tra dữ liệu nhận vào
import propTypes from "prop-types";
//actions
import * as newsActions from "./../../actions/news";
//firebase
import fire from "./../../config/Fire";

class NewsBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: "",
      progress: 0
    };
  }
  handleChange = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState({ image });
    }
  };

  //////load trang
  componentDidMount() {
    const { newsActionsCreator } = this.props;

    const { fetchNewsSuccess, fetchNewsFailed } = newsActionsCreator;

    //lấy dữ liệu trên firebase có database là videos
    fire
      .firestore()
      .collection("news")
      .get()
      .then(data => {
        let news = [];
        data.forEach(doc => {
          news.push({
            newsId: doc.id,
            nameUser: doc.data().nameUser,
            link: doc.data().link,
            content: doc.data().content,
            createdAt: doc.data().createdAt,
            shareCount: doc.data().shareCount,
            likeCount: doc.data().likeCount,
            commentCount: doc.data().commentCount,
            image: doc.data().image
          });
        });
        fetchNewsSuccess(news);
      })
      .catch(err => {
        console.log(err);
        fetchNewsFailed(err);
      });
  }

  //////
  renderNewsList = () => {
    const { newsList } = this.props;
    let xhtml = null;
    if (newsList.length > 0) {
      xhtml = <NewsList newsList={newsList} />;
    } else {
      xhtml = (
        <Grid container spacing={2} style={{ paddingTop: "10px" }}>
          <Grid item md={5} xs={12}></Grid>
          <Grid item md={4} xs={12}>
            <h3>Loading...</h3>
          </Grid>
          <Grid item md={3} xs={12}></Grid>
        </Grid>
      );
    }
    return xhtml;
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={2} style={{ paddingTop: "10px" }}>
        <Grid item md={3} xs={12}></Grid>
        <Grid item md={6} xs={12}>
          <Card className={classes.cardContent}>
            <Avatar
              style={{ margin: "15px 0 0 15px" }}
              src="https://tunglocpet.com/wp-content/uploads/2017/10/cho-corgi-pembroke-tunglocpet-03.jpg"
            />

            <TextField
              id="outlined-basic"
              variant="outlined"
              className={classes.formContent}
            />

            <Grid container spacing={2} style={{ paddingTop: "10px" }}>
              <Grid item md={3} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <progress
                  value={this.state.progress}
                  max="100"
                  style={{ marginBottom: "5px", height: "20px" }}
                />

                <input
                  className={classes.input}
                  id="icon-button-file"
                  type="file"
                  onChange={this.handleChange}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    style={{ marginTop: "-10px" }}
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera fontSize="large" />
                  </IconButton>
                </label>
              </Grid>
              <Grid item md={4} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  size="small"
                  // onClick={() => this.openFormLink({ file: false, link: true })}
                >
                  <AddIcon fontSize="small" />
                  Đăng
                </Button>
              </Grid>
            </Grid>
          </Card>
          {this.renderNewsList()}
        </Grid>
        <Grid item md={3} xs={12}></Grid>
      </Grid>
    );
  }
}
//check props nhận vào
NewsBoard.propTypes = {
  classes: propTypes.object,
  newsList: propTypes.array,
  newsActionsCreator: propTypes.shape ({
    fetchNewsSuccess: propTypes.func,
    fetchNewsFailed: propTypes.func
  })
};

const mapStateToProps = state => {
  return {
    newsList: state.news.newsList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    newsActionsCreator: bindActionCreators(newsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NewsBoard));
