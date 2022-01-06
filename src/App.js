import React from 'react';
//All database saved in JSON files
import * as form from './form.json' // data login - id[0] : name[0]
import * as co from './co.json' // data candidates
import axios from 'axios';
const API_PATH = 'http://localhost/index.php';
const API_PATH_LOGIN = 'http://localhost:5000/login';
const API_PATH_LOGIN_CHECKED = 'http://localhost:5000/login_checked';
const API_PATH_UPDATE_PASSWORD = 'http://localhost:5000/update_password';
const API_PATH_UPDATE_INFORMATION = 'http://localhost:5000/update_information';
const API_PATH_GET_INFORMATION = 'http://localhost:5000/get_information';
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue_Name: '',
      inputValue_ID: '',
      open_vote: false,
      vote: false,
      login: false,
      name: '',
      title: "",
      facebook: "",
      instagram: "",
      github_link: "",
      github_name: "",
      kwords:[],
      vide:'',
      id: 0,
      img: "#",
      dis_vote: false,
      page: 'home',
      show_social: false,
      user_name: '',
      user_title: '',
      user_facebook: '',
      user_instagram: '',
      user_github_name: '',
      user_img: '',
      user_words: '',
      user_vid: '',
      user_email: '',
      user_message: ''
    };

    this.onInputChange_Name = this.onInputChange_Name.bind(this)
    this.onInputChange_ID = this.onInputChange_ID.bind(this)
    this.onLoginPress = this.onLoginPress.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onVote = this.onVote.bind(this)
    this.pre = this.pre.bind(this)
    this.next = this.next.bind(this)
    this.changepage = this.changepage.bind(this)
    this.onInputChange_Info = this.onInputChange_Info.bind(this)
    this.onChangePass = this.onChangePass.bind(this)
    this.sendMail = this.sendMail.bind(this)
  }
  componentDidMount() {
    let data_cookie = document.cookie.split(";")
    console.log(document.cookie)
    for (let i = 0; i < data_cookie.length; i++) {
      let xi = data_cookie[i].split('=')
      if (xi[0].trim() === 'idstudent') {
        this.setState({
          inputValue_ID: xi[1]
        })
        axios({
          method: 'post',
          url: API_PATH_LOGIN_CHECKED,
          data: {
            id: xi[1]
          }
        }).then(res => {
          if (res.data.status == 'success') {
            console.log('success')
            axios({
              method: 'post',
              url: API_PATH_GET_INFORMATION,
              data: {
                name: res.data.name,
              }
            }).then(resq => {
              if (resq.data.status == 'success') {
                console.log('success')
                let info = resq.data.data
                this.setState({
                  open_vote: true,
                  name: info["name"],
                  title: info["title"],
                  facebook: info["facebook"],
                  instagram: info["instagram"],
                  github_link: "https://github.com/" + info["github_username"],
                  github_name: info["github_username"],
                  id: 1,
                  img: info["img"],
                  inputValue_ID: xi[1],
                  inputValue_Name: res.data.name,
                })
                let threekeywords = info["properties"].join(', ')
                this.setState({
                  user_name: info["name"],
                  user_title: info["title"],
                  user_facebook: info["facebook"],
                  user_instagram: info["instagram"],
                  user_github_name: info["github_username"],
                  user_img: info["img"],
                  user_words: threekeywords,
                  kwords: info["properties"],
                  user_vid: info["vid"],
                  vide: info["vid"],
                })
                for (let y = 0; y < data_cookie.length; y++) {
                  let yi = data_cookie[y].split('=')
                  if (yi[0].trim() === 'voted_id' && parseInt(yi[1]) === 1) {
                    this.setState({
                      vote: true,
                      dis_vote: false,
                      show_social: true
                    })
                    break
                  }
                }
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }).catch(err => {
          console.log(err)
        })
        break
      }
    }
  }
  pre(e) {
    console.log(this.state.id)
    if (this.state.id > 1) {
      axios({
        method: 'post',
        url: API_PATH_GET_INFORMATION,
        data: {
          name: this.state.id-1,
        }
      }).then(res => {
        if (res.data.status == 'success') {
          console.log('success')
          let info = res.data.data
          let set_id = this.state.id - 1
          let threekeywords = info["properties"].join(', ')
          this.setState({
            name: info["name"],
            title: info["title"],
            vote: false,
            dis_vote: true,
            show_social: false,
            facebook: info["facebook"],
            instagram: info["instagram"],
            github_link: "https://github.com/" + info["github_username"],
            github_name: info["github_username"],
            id: set_id,
            img: info["img"],
            kwords: info["properties"],
            vide: info["vid"]
          })
          let check_vote_x = document.cookie
          let multiple = check_vote_x.split(';')
          let has_vote_id = false
          for (let i = 0; i < multiple.length; i++) {
            let check_vote = multiple[i].split('=')
            if (check_vote[0].trim() === 'voted_id' && parseInt(check_vote[1]) === set_id) {
              console.log('all pre: ', set_id, parseInt(check_vote[1]), check_vote[0].trim() === 'voted_id', parseInt(check_vote[1]) === set_id)
              this.setState({
                vote: true,
                dis_vote: false,
                show_social: true
              })
              has_vote_id = true
              break
            }
            if (check_vote[0].trim() === 'voted_id' && parseInt(check_vote[1]) === 0) {
              this.setState({
                vote: false,
                dis_vote: false,
              })
              has_vote_id = true
            }
          }
          if (!has_vote_id) {
            this.setState({
              vote: false,
              dis_vote: false,
            })
          }
        }}).catch(err => {
          console.log(err)
        })
    }
  }
  next(e) {
    axios({
      method: 'post',
      url: API_PATH_GET_INFORMATION,
      data: {
        name: this.state.id+1,
      }
    }).then(res => {
      if (res.data.status == 'success') {
        console.log('success')
        let info = res.data.data
        let set_id = this.state.id + 1
        let threekeywords = info["properties"].join(', ')
        this.setState({
          name: info["name"],
          title: info["title"],
          vote: false,
          dis_vote: true,
          show_social: false,
          facebook: info["facebook"],
          instagram: info["instagram"],
          github_link: "https://github.com/" + info["github_username"],
          github_name: info["github_username"],
          id: set_id,
          img: info["img"],
          kwords: info["properties"],
          vide: info["vid"]
        })
        let check_vote_x = document.cookie
        let multiple = check_vote_x.split(';')
        let has_vote_id = false
        for (let i = 0; i < multiple.length; i++) {
          let check_vote = multiple[i].split('=')
          if (check_vote[0].trim() === 'voted_id' && parseInt(check_vote[1]) === set_id) {
            console.log('all next: ', set_id, parseInt(check_vote[1]), check_vote[0].trim() === 'voted_id', parseInt(check_vote[1]) === set_id)
            this.setState({
              vote: true,
              dis_vote: false,
              show_social: true
            })
            has_vote_id = true
            break
          }
          if (check_vote[0].trim() === 'voted_id' && parseInt(check_vote[1]) === 0) {
            this.setState({
              vote: false,
              dis_vote: false,
            })
            has_vote_id = true
          }
        }
        if (!has_vote_id) {
          this.setState({
            vote: false,
            dis_vote: false,
          })
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }
  onVote(e) {
    if (this.state.vote) {
      co.default[this.state.id].voted -= 1
      this.setState({
        vote: false,
        dis_vote: false,
        show_social: false
      })
      document.cookie = 'voted_id=' + '0'
    } else {
      co.default[this.state.id].voted += 1
      this.setState({
        vote: true,
        dis_vote: false,
        show_social: true
      })
      document.cookie = 'voted_id=' + this.state.id.toString()
    }
  }
  onInputChange_ID(e) {
    const { value } = e.target;
    this.setState({
      inputValue_ID: value
    });

  }
  onInputChange_Name(e) {
    const { value } = e.target;
    this.setState({
      inputValue_Name: value
    });

  }
  onLoginPress(e) {
    const { inputValue_ID, inputValue_Name } = this.state;
    axios({
      method: 'post',
      url: `${API_PATH_LOGIN}`,
      data: {
        id: inputValue_ID,
        name: inputValue_Name,
      },
    }).then(res => {
      console.log(res.data)
      if (res.data.status === 'success') {
        this.setState({
          login: true
        })
      }
      if (this.state.login) {
        console.log('success');
        document.cookie = 'idstudent=' + inputValue_ID.toString()
        axios({
          method: 'post',
          url: `${API_PATH_GET_INFORMATION}`,
          data: {
            name: inputValue_Name,
          },
        }).then(resq => {
          console.log(resq.data)
          if (resq.data.status === 'success') {
            let info = resq.data.data
            this.setState({
              open_vote: true,
              name: info["name"],
              title: info["title"],
              facebook: info["facebook"],
              instagram: info["instagram"],
              github_link: "https://github.com/" + info["github_username"],
              github_name: info["github_username"],
              id: 1,
              img: info["img"],
            })
            let threekeywords = info["properties"].join(', ')
            this.setState({
              user_name: info["name"],
              user_title: info["title"],
              user_facebook: info["facebook"],
              user_instagram: info["instagram"],
              user_github_name: info["github_username"],
              user_img: info["img"],
              user_words: threekeywords,
              kwords: info["properties"],
              user_vid: info["vid"],
              vide: info["vid"]
            })
            let data_cookie = document.cookie.split(";")
            for (let y = 0; y < data_cookie.length; y++) {
              let yi = data_cookie[y].split('=')
              if (yi[0].trim() === 'voted_id' && parseInt(yi[1]) === 1) {
                this.setState({
                  vote: true,
                  dis_vote: false,
                  show_social: true
                })
                break
              }
            }
          }
        })
      } else {
        console.log('fail');
        alert('Login failed')
      }
    }).catch(err => {
      console.log(err)
    })
  }
  onSubmit(e) {
    axios({
      method: 'post',
      url: `${API_PATH_UPDATE_INFORMATION}`,
      data: {
        name: this.state.inputValue_Name,
        data: {
          name: this.state.user_name,
          title: this.state.user_title,
          facebook: this.state.user_facebook,
          instagram: this.state.user_instagram,
          github_username: this.state.user_github_name,
          img: this.state.user_img,
          vid: this.state.user_vid,
          properties: this.state.user_words.split(', ')
        }
      },
    }).then(res => {
      console.log(res.data)
      if (res.data.status === 'success') {
        alert('Update success')
      } else {
        alert('Update failed')
      }
    }).catch(err => {
      console.log(err)
    })
  }
  onInputChange_Info(e, field) {
    const { value } = e.target;
    let changes = {}
    changes[field] = value
    this.setState(changes);
  }
  onChangePass(e) {
    // form.default.id_student[form.default.name.findIndex((names) => names.trim() == this.state.user_name.trim())] = this.state.inputValue_ID
    axios({
      method: 'post',
      url: `${API_PATH_UPDATE_PASSWORD}`,
      data: {
        id: this.state.inputValue_ID,
        name: this.state.user_name
      },
    }).then(res => {
      console.log(res.data)
      if (res.data.status === 'success') {
        console.log('success');
        alert('Change password success')
        window.location.reload(false);
      } else {
        console.log('fail');
        alert('Change password fail')
      }
    })
  }
  changepage(e) {
    this.setState({
      page: e
    })
  }
  sendMail(e) {
    axios({
      method: 'post',
      url: `${API_PATH}`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        fname: this.state.user_name,
        email: this.state.user_email,
        message: this.state.user_message
      }
    }).then(result => {
      console.log('result.data.sent', result)
      alert('Send mail success')
      // this.setState({
      //   mailSent: result.data.sent
      // })
    })
  }
  render() {
    const { inputValue_ID, inputValue_Name, open_vote } = this.state;
    const { user_img, user_name, user_title, user_facebook, user_instagram, user_github_name, user_words, user_vid, user_email, user_message } = this.state;
    return (
      <div align-items="center">
        {
          !open_vote ?
            <div className="wrap-login100">
              <div className="login100-pic js-tilt" data-tilt>
                <img src="images/king_queen.png" alt="IMG" />
              </div>
              <form className="login100-form validate-form">
                <span className="login100-form-title"> Member Login</span>
                <div className="wrap-input100 validate-input">
                  <input className="input100" type="text" name="id" placeholder=" Full Name?" spellCheck="false" value={inputValue_Name} onChange={e => this.onInputChange_Name(e)} />
                  <span className="focus-input100"></span>
                  <span className="symbol-input100">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </span>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="pass" placeholder=" ID Student?" spellCheck="false" value={inputValue_ID} onChange={e => this.onInputChange_ID(e)} />
                  <span className="focus-input100"></span>
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true"></i>
                  </span>
                </div>
                <div className="container-login100-form-btn">
                  <button type="button" className="login100-form-btn" onClick={this.onLoginPress}>Login</button>
                  <div className="registerAcc">
                    <a href='#' className='register'>Register</a>
                    <div className="overlay">
                      <div className="text">
                        {/* <iframe
                              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ">
                            </iframe> */}
                        <div className="elfsight-app-0c21f23e-c0f1-4c64-a4e8-91561169470b"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center p-t-136">
                  <a className="txt2" href="#">Welcome to Ship Love</a>
                </div>
              </form>
            </div> : <div className="card">
              <div>
                <ul className="menu">
                  {this.state.page == "home" ? <li title="home"><a href="#" className="menu-button home clicked" onClick={() => this.changepage('home')}></a></li> : <li title="home"><a href="#" className="menu-button home" onClick={() => this.changepage('home')}></a></li>}
                  {this.state.page == "editpage" ? <li title="edit your card"><a href="#" className="editpage clicked" onClick={() => this.changepage('editpage')}></a></li> : <li title="edit your card"><a href="#" className="editpage" onClick={() => this.changepage('editpage')}></a></li>}
                  {this.state.page == "personalpage" ? <li title="about"><a href="#" className="active about clicked" onClick={() => this.changepage('personalpage')}></a></li> : <li title="about"><a href="#" className="active about" onClick={() => this.changepage('personalpage')}></a></li>}
                  <li title="contact"><a href="#" className="contact" onClick={() => this.changepage('contactpage')}></a></li>
                </ul>
              </div>
              {this.state.page == "home" ? <div>
                <div className="container">
                  <div className="container-img">
                    <img src={this.state.img} alt={this.state.name} />
                    <div className="overlay">
                      <div className="text">
                        <iframe
                          src={this.state.vide}>
                        </iframe>
                      </div>
                    </div>
                  </div>
                  <div className="price center-bottom-img">Price: ☕</div>
                  <div className="price-more center-bottom-img-add">
                    <i className="fa fa-plus">
                      <div className="tooltiptext">
                        {
                          this.state.kwords.map((prop, index) => {
                            return <span key={index}>{prop}</span>
                          })
                        }
                      </div >
                    </i>
                  </div>
                </div>
                <h4>{this.state.name}</h4><p></p>
                <p className="title">{this.state.title}</p><p></p>
                <div position='relative'>
                  {this.state.show_social ?
                    <div className="row justify-content-md-center">
                      <div className="col-md-2">
                        <a href={this.state.facebook}><i className="fa fa-facebook"></i></a>
                      </div>
                      <div className="col-md-2">
                        <a href={this.state.instagram}><i className="fa fa-instagram"></i></a>
                      </div>
                      <div className="col-md-2">
                        <a href={this.state.github_link}><i className="fa fa-github"></i></a>
                      </div>
                    </div> : null}
                  <div className="git-card">
                    <a href={this.state.github_link}>
                      <img align="center" src={"https://github-readme-stats.vercel.app/api/top-langs/?username=" + this.state.github_name + "&&langs_count=3&theme=default&hide=html&layout=compact&show_icons=true&bg_color=#ffffff"} />
                    </a>
                  </div>
                </div>
                <div className="control" position='flat'>
                  <button className="pre" onClick={this.pre}>Pre</button>
                  {
                    this.state.dis_vote ? <span id="heart">{!this.state.vote ? <i className="fa fa-heart-o" aria-hidden="true" ></i> : <i className="fa fa-heart" aria-hidden="true" ></i>} </span> :
                      <span id="heart" onClick={this.onVote} >{!this.state.vote ? <i className="fa fa-heart-o pop-on-hover" aria-hidden="true" ><span className="tooltiptext">My gu 😍!</span></i> : <i className="fa fa-heart pop-on-hover" aria-hidden="true" ><span className="tooltiptext">Un crush 😢</span></i>} </span>
                  }
                  <button className="next" onClick={this.next}>Next</button>
                </div>
              </div> : null}
              {this.state.page == "editpage" ? <div>
                <div id="edit-ucard">
                  <div align-items="center">
                    <div className="wrap-login100">
                      <form className="login100-form validate-form">
                        <span className="login100-form-title"> Member Card</span>
                        <div className="wrap-input100 validate-input" data-validate="Facebook avatar is required">
                          <input className="input100" type="text" name="avatar" placeholder=" Facebook avatar url?" spellCheck="false" value={user_img} onChange={e => this.onInputChange_Info(e, "user_img")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-picture-o" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="FullName is required">
                          <input className="input100" type="text" name="name" placeholder=" Full Name?" spellCheck="false" value={user_name} onChange={e => this.onInputChange_Info(e, "user_name")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-user" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Title is required">
                          <input className="input100" type="text" name="title" placeholder=" Who you are?" spellCheck="false" value={user_title} onChange={e => this.onInputChange_Info(e, "user_title")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-sticky-note" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Github username is required">
                          <input className="input100" type="text" name="name" placeholder=" Github username?" spellCheck="false" value={user_github_name} onChange={e => this.onInputChange_Info(e, "user_github_name")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-github" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100">
                          <input className="input100" type="text" name="name" placeholder=" Facebook url?" spellCheck="false" value={user_facebook} onChange={e => this.onInputChange_Info(e, "user_facebook")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-facebook-square" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100">
                          <input className="input100" type="text" name="name" placeholder=" Instagram url?" spellCheck="false" value={user_instagram} onChange={e => this.onInputChange_Info(e, "user_instagram")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-instagram" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Video url is required">
                          <input className="input100" type="text" name="name" placeholder=" Video url intro about you?" spellCheck="false" value={user_vid} onChange={e => this.onInputChange_Info(e, "user_vid")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-play" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Keywords is required">
                          <input className="input100" type="text" name="name" placeholder=" 3 keywords about you?" spellCheck="false" value={user_words} onChange={e => this.onInputChange_Info(e, "user_words")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-font" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="container-login100-form-btn">
                          <button type="button" className="login100-form-btn" onClick={this.onSubmit}>OK</button>
                        </div>

                        <div className="text-center p-t-136">
                          <a className="txt2" href="#">Ready to find a love?</a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div> : null}
              {this.state.page == "personalpage" ? <div>
                <div id="edit-ucard">
                  <div align-items="center">
                    <div className="wrap-login100">
                      <form className="login100-form validate-form">
                        <span className="login100-form-title"> Personal Card</span>
                        <div className="wrap-input100 validate-input" data-validate="Full Name is required">
                          <input className="input100" type="text" name="avatar" placeholder=" Full Name?" spellCheck="false" value={user_name} onChange={e => this.onInputChange_Info(e, "user_name")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-user" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="ID is required">
                          <input className="input100" type="text" name="name" placeholder=" ID Student?" spellCheck="false" value={inputValue_ID} onChange={e => this.onInputChange_Info(e, "inputValue_ID")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-lock" aria-hidden="true"></i>
                          </span>
                        </div>

                        <div className="container-login100-form-btn">
                          <button type="button" className="login100-form-btn" onClick={this.onChangePass}>OK</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div> : null}
              {this.state.page == "contactpage" ? <div>
                <div id="edit-ucard">
                  <div align-items="center">
                    <div className="wrap-login100">
                      <form className="login100-form validate-form">
                        <span className="login100-form-title"> Mail Card</span>
                        <div className="wrap-input100 validate-input" data-validate="Full Name is required">
                          <input className="input100" type="text" name="avatar" placeholder=" Full Name?" spellCheck="false" value={user_name} onChange={e => { }} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-user" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Email is required">
                          <input className="input100" type="text" name="avatar" placeholder=" Your email?" spellCheck="false" value={user_email} onChange={e => this.onInputChange_Info(e, "user_email")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-envelope" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Message is required">
                          <input className="input100" type="text" name="name" placeholder=" Your message?" spellCheck="false" value={user_message} onChange={e => this.onInputChange_Info(e, "user_message")} />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="fa fa-comments-o" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="container-login100-form-btn">
                          <button type="button" className="login100-form-btn sendmail" onClick={this.sendMail}>SEND</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div> : null}
            </div>
        }
      </div>
    );
  }
}

export default App;
