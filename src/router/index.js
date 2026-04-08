import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import RegisterAgreement from '../components/Register/RegisterAgreement.vue'
import RegisterAccount from '../components/Register/RegisterAccount.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      component: RegisterView,
      children: [
        // /register 접근 시 1단계(약관 동의)로 리다이렉트
        { path: '', redirect: '/register/agreement' },
        { path: 'agreement', component: RegisterAgreement },
        { path: 'account', component: RegisterAccount },
      ],
    },
  ],
})

export default router
