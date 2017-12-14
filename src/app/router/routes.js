/**
 * @author panezhang
 * @date 2017/12/12-下午7:41
 * @file RouterMap
 * 我们在引用路由的时候，尽量保证通过 name 去引用
 * 一旦一个路由的 name 被确定之后，理论上来说，不应该再去改变它，它标志着这个页面的功能和角色
 */

export default [
    {
        path: '',
        name: 'index',
        component: () => import('src/app/view/index')
    },
    {
        path: '/demo/:id',
        name: 'demo',
        component: () => import('src/app/view/demo'),
        props: true
    },
    {
        path: '*',
        component: () => import('src/app/view/not-found')
    }
];
