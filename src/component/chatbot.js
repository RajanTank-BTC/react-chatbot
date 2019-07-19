import React from 'react'
import ChatBot from 'react-simple-chatbot'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class ApiComponent extends React.Component {
  state = {
    posts: [],
    value: '',
    display: true
  }
  componentDidMount() {

  }

  handleClick = (id) => {

    const { triggerNextStep, nextTrigger } = this.props
    console.log(id, nextTrigger)
    console.log(this.props, "dd")
    triggerNextStep({
      value: id,
      customOption: {
        value: `${id}`,
        label: `${id}`,
        trigger: nextTrigger
      },
      trigger: nextTrigger

    })
    this.setState({ display: !this.state.display })
  }

  handlePress = (event) => {

    if (event.key === 'Enter') {
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => this.setState({ posts: json }))
    }
  }

  render() {
    return (
      <div >
        <div>
          <p style={{ fontSize: 20, color: 'black' }}>Search product</p>
          <input type='text' name='search' value={this.state.value} onChange={event => { this.setState({ value: event.target.value }) }}
            onKeyPress={this.handlePress} />
        </div>
        <table>
          <tbody>
            {this.state.posts &&
              this.state.posts.map((post) => {
                return (<tr key={post.id}>
                  <td style={{ color: 'black', fontSize: 20 }}>Title</td>
                  <td style={{ color: 'black', fontSize: 20, cursor: 'pointer' }}
                    onClick={() => this.handleClick(post.id)}>{post.id}</td>
                </tr>)
              })}
          </tbody>
        </table>
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
    console.log(steps)
    console.log(value)
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => this.setState({ posts: json }))
  }

  render() {
    const { opened } = this.state;
    return (
      <div style={{ alignItems: 'right' }}>
        <ChatBot
          floating={true}
          opened={opened}
          toggleFloating={this.toggleFloating}
          handleEnd={this.apiCall}
          // style={{ width: '100%' }}
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
        <div>
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
        </div>
      </div>
    )
  }
}
export default ChatbotDemo