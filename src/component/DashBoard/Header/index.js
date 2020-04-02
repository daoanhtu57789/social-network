import React, { Component } from "react";
//material-ui
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import HomeIcon from "@material-ui/icons/Home";
import FacebookIcon from "@material-ui/icons/Facebook";
import GitHubIcon from "@material-ui/icons/GitHub";
import InstagramIcon from "@material-ui/icons/Instagram";
import ArrowDropDownCircleIcon from "@material-ui/icons/ArrowDropDownCircle";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
//css
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import propTypes from "prop-types";
//clsx để gộp nhiều class
import clsx from "clsx";
//firebase
import fire from './../../../config/Fire';
//
import {withRouter} from 'react-router-dom';

//biến global
const menuId = "primary-search-account-menu";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      isMenuOpen: false,
      expanded: false
    };
  }
  //Xoay icon đăng xuất khi click

  handleProfileMenuOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
      isMenuOpen: true,
      expanded: true
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      isMenuOpen: false,
      expanded: false
    });
  };

  //logout
  handleLogout = () => {
    const { history } = this.props;
    fire.auth().signOut();
    history.push("/login");
  };
  //function lấy 6 kí tự đầu của tên
  renderNameUser = name => {
    var newName = "";
    var arrayName = name.split(" ");
    for (let i = 0; i < arrayName.length; i++) {
      if (i < 2) {
        newName += arrayName[i] + " ";
      }
    }
    return newName;
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, isMenuOpen, expanded } = this.state;
    const nameUser = "Đào Anh Tú";
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
        style={{ marginTop: "30px" }}
      >
        <MenuItem
          className={classes.menuLinkActive}
          onClick={this.handleLogout}
        >
          Your Profile
        </MenuItem>
        <MenuItem
          className={classes.menuLinkActive}
          onClick={this.handleLogout}
        >
          Your Friend
        </MenuItem>
        <MenuItem
          className={classes.menuLinkActive}
          onClick={this.handleLogout}
        >
          Settings
        </MenuItem>
        <MenuItem
          className={classes.menuLinkActive}
          onClick={this.handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>
    );
    return (
      <div>
        <AppBar style={{ height: "50px" }} position="fixed">
          <Toolbar>
            {/* Dấu gạch ngang */}
            <div>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
                size="small"
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </div>
            <div>
              <Typography className={classes.title} variant="h6" noWrap>
                Zero Social
              </Typography>
            </div>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon fontSize="small" />
              </div>
              <InputBase
                fontSize="small"
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
            <div>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
                size="small"
              >
                <Avatar
                  alt="Đào Anh Tú"
                  src="https://azpet.com.vn/wp-content/uploads/2019/01/Cho-Corgi-7.jpg"
                  style={{marginBottom:'5px'}}
                />
                <Typography style={{ fontSize: "17px" }}>
                  {this.renderNameUser(nameUser)}
                </Typography>
              </IconButton>
            </div>
            <div className={classes.grow} />
            <div>
              <IconButton color="inherit">
                <Badge color="secondary">
                  <HomeIcon />{" "}
                  <span style={{ fontSize: "15px", lineHeight: "30px" }}>
                    Trang Chủ
                  </span>
                </Badge>
              </IconButton>
            </div>
            {/* icon mid */}
            <div className={classes.grow} />
            <div>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <PersonAddIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </div>
            <div className={classes.grow} />
            {/* flex về cuối*/}
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit">
                <Badge color="secondary">
                  <a
                    style={{ color: "white", marginTop: "6px" }}
                    href="https://facebook.com/dat5498"
                    target="blank"
                  >
                    <FacebookIcon />
                  </a>
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge color="secondary">
                  <a
                    style={{ color: "white", marginTop: "6px" }}
                    href="https://instagram.com"
                    target="blank"
                  >
                    <InstagramIcon />
                  </a>
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge color="secondary">
                  <a
                    style={{ color: "white", marginTop: "6px" }}
                    href="https://github.com/daoanhtu57789"
                    target="blank"
                  >
                    <GitHubIcon />
                  </a>
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                onClick={this.handleProfileMenuOpen}
                aria-expanded={expanded}
              >
                <ArrowDropDownCircleIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </div>
    );
  }
};

//check props nhận vào
Header.propTypes = {
  classes: propTypes.object,
  history: propTypes.object,
};

export default withStyles(styles)(withRouter(Header));
