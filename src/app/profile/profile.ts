import { Component, signal, computed } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { OrderModel } from '../../models/order.model';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  protected activeUser = signal<UserModel | null>(null)
  protected statusMap = {
    'na': 'Rezervisano',
    'paid': 'Pristiglo',
    'canceled': 'Otkazano',
    'liked': 'Dobro ocenjeno',
    'disliked': 'Loše ocenjeno'
  }
  
  constructor(private router: Router) {
    if (!UserService.hasAuth()) {
      localStorage.setItem(UserService.TO_KEY, '/profile')
      router.navigateByUrl('/login')
      return
    }

    this.activeUser.set(UserService.getActiveUser())
  }

  protected pay(order: OrderModel) {
    UserService.updateOrder(order.orderId, 'paid')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected cancel(order: OrderModel) {
    UserService.updateOrder(order.orderId, 'canceled')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected delete(order: OrderModel) {
    UserService.deleteOrder(order.orderId)
    this.activeUser.set(UserService.getActiveUser())
  }

  protected like(order: OrderModel) {
    UserService.updateOrder(order.orderId, 'liked')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected dislike(order: OrderModel) {
    UserService.updateOrder(order.orderId, 'disliked')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected totalPrice = computed(() => {
    const user = this.activeUser();
    if (!user || !user.data) return 0;

    return user.data.reduce((sum, order) => {
        if (order.status === 'canceled' || order.status === 'paid') return sum;
        
        return sum + (order.price * order.quantity);
    }, 0);
});
}
