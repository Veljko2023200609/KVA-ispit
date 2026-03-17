import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { Utils } from './utils';
import { MessageModel } from '../models/message.model';
import { RasaService } from '../services/rasa.service';
import { FormsModule } from '@angular/forms';
import { ToyModel } from '../models/toy.model';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected year = new Date().getFullYear()
  protected waitingForResponse: boolean = false
  protected botThinkingPlaceholder: string = 'Razmišljam ...'
  protected isChatVisible: boolean = false
  protected userMessage: string = ''
  protected messages: MessageModel[] = []

  constructor(private router: Router, private utils: Utils) {
    this.messages.push({
      type: 'bot',
      text: 'Kako Vam mogu pomoći?'
    })
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible
  }

  async sendUserMessage() {
    if (this.waitingForResponse) return

    const trimmedMessage = this.userMessage.trim()
    this.userMessage = ''

    this.messages.push({
      type: 'user',
      text: trimmedMessage
    })
    this.messages.push({
      type: 'bot',
      text: this.botThinkingPlaceholder
    })

    RasaService.sendMessage(trimmedMessage)
      .then(rsp => {
        if (rsp.data.length == 0) {
          this.messages.push({
            type: 'bot',
            text: "Izvinite, nisam Vas razumeo."
          })
          return
        }
        for (let message of rsp.data) {
          if (message.attachment != null) {

            if (message.attachment.type == 'toy_list' && Array.isArray(message.attachment.data)) {
              let html = ''
              for (let toy of message.attachment.data as ToyModel[]) {
                html += `<ul class='list-unstyled'>`
                html += `<li>${toy.name}</li>`
                html += `<li>Cena: ${toy.price}</li>`
                html += `<li>Uzrast: ${toy.ageGroup.name}</li>`
                html += `<li>Pol: ${toy.targetGroup}</li>`
                html += `</ul>`
                html += `<p>${toy.description}</p>`
              }

              this.messages.push({
                type: 'bot',
                text: html
              })
            }

          }
          this.messages.push({
            type: 'bot',
            text: message.text
          })
        }

        this.messages = this.messages.filter(m => {
          if (m.type === 'bot') {
            return m.text != this.botThinkingPlaceholder
          }
          return true
        })
      })

  }

  getUserName() {
    const user = UserService.getActiveUser()
    return `${user.firstName} ${user.lastName}`
  }

  hasAuth() {
    return UserService.hasAuth()
  }

  doLogout() {
    this.utils.showDialog(
      "Da li zaista želite da se odjavite?", () => {
        UserService.logout()
        this.router.navigateByUrl('/login')
      },
      "Odjavi me odmah",
      "Otkaži"
    )
  }
}
