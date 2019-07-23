import React from 'react'
import ChatBot from 'react-simple-chatbot'
import { ThemeProvider } from 'styled-components'
import chatIcon from '../chat.svg'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

const theme = {
  background: '#f5f8fb',
  fontFamily: 'arial',
  headerBgColor: '#0CD7FF',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#E5F9FC',
  botFontColor: '#000',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class ApiComponent extends React.Component {
  state = {
    posts: [],
    value: '',
    display: true
  }
  componentDidMount() {

  }

  handleClick = (name) => {

    const { triggerNextStep, nextTrigger } = this.props
    triggerNextStep({
      value: name,
      customOption: {
        value: `${name}`,
        label: `${name}`,
        trigger: nextTrigger
      },
      trigger: nextTrigger

    })
    this.setState({ display: !this.state.display })
  }

  handleChange = (event) => {
    if (event.target.value.length > 3) {
      fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
        .then(response => response.json())
        .then(json => this.setState({ posts: json }))
    }
  }

  render() {
    return (
      <div className="search-box">
        <h3>Search product</h3>
        <input type='text' name='search' onChange={event => { this.handleChange(event) }} />
        {this.state.posts.length > 0 &&
          <PerfectScrollbar className="product-list">
            <ul>
              {this.state.posts &&
                this.state.posts.map((post) => {
                  return (<li key={post.id} onClick={() => this.handleClick(post.title)}>
                    <title><small>Product Name</small>{post.title}</title>
                    <div className="details">
                      <p><small>Point- </small> 7698</p>
                      <p><small>Qty- </small> 676.50</p>
                      <p><small>Cost- </small> ${post.id}</p>
                    </div>
                  </li>)
                })}
            </ul>
          </PerfectScrollbar>
        }
      </div>
    )
  }
}


class ChatbotDemo extends React.Component {
  state = {
    opened: false,
    posts: []
  }

  toggleFloating = ({ opened }) => {
    this.setState({ opened });
  }

  apiCall = ({ steps, value }) => {
    fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
      .then(response => response.json())
      .then(json => this.setState({ posts: json }))
  }

  render() {
    const { opened } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <div style={{ alignItems: 'right' }}>
          <ChatBot
            floating={true}
            opened={opened}
            toggleFloating={this.toggleFloating}
            handleEnd={this.apiCall}
            floatingIcon={chatIcon}
            className="chat-box"
            steps={[
              {
                id: '1',
                message: 'please let me know which product you want to check.',
                trigger: '2',
              },
              {
                id: '2',
                component: <ApiComponent nextTrigger='3' />,
              },
              {
                id: '3',
                message: 'ok can you please specify how much quantity you want?',
                trigger: 4
              },
              {
                id: '4',
                placeholder: 'Type how much quantity ...',
                user: true,
                validator: (value) => {
                  if (!isNaN(value) && value.length > 0) {
                    return true
                  }
                  return 'Please enter number only'
                },
                trigger: '5'
              },
              {
                id: '5',
                message: 'ok can I have your email address so that we can send the quotation?',
                trigger: '6'
              },
              {
                id: '6',
                user: true,
                placeholder: 'Type your email ...',
                validator: (value) => {
                  if (!emailRegex.test(value)) {
                    return 'Please Enter valid email'
                  }
                  return true
                },
                trigger: '7'
              },
              {
                id: '7',
                message: 'thank you very much, we shall get back to you over email.',
                end: true
              }
            ]}
          />
          {/* <div>
            <table>
              <td>Title</td>
              <td>Id</td>
              <td>Message</td>
              <tbody>
                {this.state.posts.map((post) => {
                  return (
                    <tr>
                      <td>{post.userId}</td>
                      <td>{post.title}</td>
                      <td>{post.id}</td>
                    </tr>

                  )
                })}
              </tbody>
            </table>
          </div> */}
        </div>
      </ThemeProvider>
    )
  }
}
export default ChatbotDemo