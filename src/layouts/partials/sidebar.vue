<template>
    <div class="app-sidebar">
        <div class="app-sidebar-header">
            <div class="big-logo"><h1>Sandbox code</h1></div>
            <div class="small-logo"><h1>SC</h1></div>
        </div>
        <div class="app-sidebar-body">
            <ul class="menu">
                <li :class="{ 'is-actived' : setActiveRouter('Dashboard')}">
                    <router-link :to="{ name : 'Admin'}">
                        <span class="menu-icon"><i class="material-icons">home</i></span>
                        <span class="menu-text">Dashboard</span>
                    </router-link>
                    <ul class="mobile-menu">
                        <li>
                            <router-link :to="{ name : 'Admin'}">
                                <span class="menu-text">Dashboard</span>
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li :class="{ 'is-actived' : setActiveRouter('CloneAccount')}">
                    <router-link :to="{ name : 'CloneAccount'}">
                        <span class="menu-icon"><i class="material-icons">live_help</i></span>
                        <span class="menu-text">Clone Account</span> 
                    </router-link>
                    <ul class="mobile-menu">
                        <li>
                            <router-link :to="{ name : 'CloneAccount'}">
                                <span class="menu-text">Clone Account</span> 
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li >
                    <a  @click.stop.prevent="toggle">
                        <span class="menu-icon"><i class="material-icons">description</i></span>
                        <span class="menu-text">Competitions</span> 
                        <span class="menu-caret">
                            <i class="material-icons">keyboard_arrow_down</i>
                        </span>
                    </a>
                    <slide :active="active">
                        <ul class="sub-menu" >
                            <li :class="{ 'is-actived' : setActiveRouter('Guest')}">
                                <router-link :to="{ name : 'ContestGuest'}">
                                    <span class="menu-text">For Guest</span>
                                </router-link>
                            </li>
                            <li :class="{ 'is-actived' : setActiveRouter('Employee')}">
                                <router-link :to="{ name : 'ContestEmployee'}">
                                    <span class="menu-text">For Employee</span>
                                </router-link>
                            </li>
                        </ul>
                    </slide>
                    <ul class="mobile-menu">
                        <li :class="{ 'is-actived' : setActiveRouter('Guest')}">
                            <router-link :to="{ name : 'ContestGuest'}">
                                <span class="menu-text">For Guest</span>
                            </router-link>
                        </li>
                        <li :class="{ 'is-actived' : setActiveRouter('Employee')}">
                            <router-link :to="{ name : 'ContestEmployee'}">
                                <span class="menu-text">For Employee</span>
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import slide from 'vue-slide-up-down'
export default {
    name : 'Sidebar',
    components:{
        slide
    },
    data(){
        return {
            active: false,
            routers : {
                'Competition' : ['ContestGuest' ,'CreateGuestCompetition' , 'DetailGuestCompetition' ,'ContestEmployee' ,'CreateEmployeeCompetition' , 'DetailEmployeeCompetition'],
                'Guest' : ['ContestGuest' ,'CreateGuestCodeCompetition' , 'CreateGuestChoiceCompetition' , 'DetailGuestCompetition'],
                'Employee' : ['ContestEmployee' ,'CreateEmployeeCodeCompetition' ,'CreateEmployeeChoiceCompetition' , 'DetailEmployeeCompetition'],
                'User' : ['User' ,'CreateUser','EditUser'],
                'UserGuest' : ['Guest' ,'CreateGuest','EditGuest'],
                'Template' : ['Template' , 'CreateTemplate' ,'EditTemplate'],
                'CloneAccount' : ['CloneAccount'],
                'Dashboard' : ['Admin'],
            }
        }
    },
    methods:{
        toggle(){
            this.active = !this.active 
        },
        setActiveRouter(route){
            if( this.routers.hasOwnProperty(route)){
                return this.routers[route].indexOf(this.$route.name) >= 0 
            }
            return false
        }
    },
    created(){
        this.active = this.setActiveRouter('Competition')
    }
}
</script>

<style lang="scss" scoped>
    .app-sidebar{
        user-select: none;
        height: 100%;
        // overflow: hidden;
        &-header{
            height: 60px;
            box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
            display: flex;
            justify-content: center;
            align-items: center;
            h1{
                margin: 0;
                font-size: 18px;
                text-transform: uppercase;
                color:#fff;
            }
            .big-logo{
                display: block;
            }
            .small-logo{
                display: none;
            }
        }
        &-body{
            padding: 15px 0;
            height: calc(100% - 60px);
            ul{
                padding: 0;
                margin: 0;
                list-style-type: none;
                display: block;
                width: 100%;
                li{
                    width: 100%;
                    position: relative;
                    a{
                        color:#fff;
                        display: block;
                        width: 100%;
                        padding: 0 15px;
                        text-decoration: none;
                        font-weight: 16px;
                        min-height: 48px;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        border-radius: 6px;
                        transition: all 0.3s ease;
                        position: relative;
                        cursor: pointer;
                        margin-bottom: 5px;
                        .menu{
                            &-icon{
                                width: 24px;
                                height: 24px;
                                margin-right: 10px;
                            }
                            &-text{
                                line-height: 24px;
                            }
                            &-caret{
                                position: absolute;
                                right: 10px;
                                top: 12px;
                                height: 24px;
                                width: 24px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                transform: rotate(-90deg);
                                transition: all 0.3s ease;
                            }
                        }
                        &:hover{
                            background: rgba(255,255,255,0.3);
                            color:#fff;
                        }
                    }
                    &.is-active{
                        > a {
                            .icon-caret{
                                transform: none;
                            }
                        }
                    }
                    &.is-actived{
                        > a{
                            background: rgba(255, 255, 255, 0.3);
                        }
                    }
                }
            }
            .menu{
                padding: 0 15px;
                > li  {
                    margin-bottom: 10px;
                    > a {
                    }
                }
            }
            .sub-menu{
                transition: all 0.3s ease;
                > li {
                    > a {
                        padding: 0 15px 0 30px;
                    }
                }
            }
            .mobile-menu{
                display: none;
            }
        }
    }
    @media(max-width:1600px){
        .app-sidebar{
            &-header{
                .big-logo{
                    display: none;
                }
                .small-logo{
                    display: block;
                }
            }
            &-body{
                .menu{
                    padding: 0 10px;
                    > li  {
                        margin-bottom: 10px;
                        > a{
                            padding: 0;
                            justify-content: center;
                            .menu{
                                &-text{
                                    display: none
                                }
                                &-icon{
                                    margin: 0;
                                }
                                &-caret{
                                    display: none;
                                }
                            }
                        }
                        &:hover{
                            .mobile-menu{
                                opacity: 1;
                                visibility: visible;
                                transform: translateX(15px);
                            }
                        }
                    }
                }
                .sub-menu{
                    display: none;
                    > li {
                        > a {
                            padding: 0 0 0 15px;
                        }
                    }
                }
                .mobile-menu{
                    display: block;
                    position: absolute;
                    left: 100%;
                    top: 5px;
                    background: $primary;
                    list-style-type: none;
                    padding: 5px;
                    margin: 0;
                    box-shadow: 0 3px 1px -2px rgba(0,0,0,.1), 0 2px 2px 0 rgba(0,0,0,.1), 0 1px 3px 0 rgba(0,0,0,.1);
                    transition: all .3s ease;
                    padding: 8px;
                    border-radius: 4px;
                    transform: translateX(25px);
                    opacity: 0;
                    visibility: hidden;
                    min-width: 150px;
                    width: auto;
                    &:before{
                        content: "";
                        display: block;
                        width: 0;
                        height: 0;
                        border-style: solid;
                        border-width: 12px 18px 12px 0;
                        border-color: transparent $primary transparent transparent;
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        -webkit-transform: translateX(-100%);
                        transform: translateX(-100%);
                    }
                    >li{
                        margin-bottom: 5px;
                        > a{
                            white-space: nowrap;
                            color:#fff;
                            padding: 5px 20px;
                            min-height: 28px;
                            font-size: 14px;
                            display: flex;
                            flex-wrap: nowrap;
                            &:hover{
                                // background: 
                            }
                            .menu{
                                &-icon,&-text{
                                    display: inline-block;
                                }
                            }
                        }
                    }
                }
            }
            &-list-group{
                // .md-sidebar{
                //     list-style-type: none;
                //     padding: 15px  0;
                //     margin: 0;
                //     &-item{
                //         position: relative;
                //         padding-left: 10px;
                //         padding-right: 10px;
                //         &-router-link{
                //             .md-list-item-content{
                //                 padding: 4px 0px;
                //                 >.md-icon:first-child{
                //                     margin-right: auto;
                //                     margin-left: auto;
                //                 }
                //                 >.md-list-item-text{
                //                     display: none;
                //                 }
                //             }
                //         }
                //         &:hover{
                //             .md-sidebar-submenu{
                //                 opacity: 1;
                //                 visibility: visible;
                //                 transform: translateX(5px);
                //             }
                //         }
                //         &.router-link-is-actived{
                //             >.md-sidebar-item-router-link{
                //                 background: rgba(255,255,255,0.3);
                //                 color:$aside-list-group-color;
                //                 .md-list-item-text{
                //                     color: inherit;
                //                     text-decoration: none;
                //                 }
                //             }
                //         }
                //     }
                //     &-submenu{
                //         position: absolute;
                //         left: 100%;
                //         top: 0;
                //         width: 200px;
                //         background: #242539;
                //         padding: 0;
                //         margin: 0;
                //         box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                //         opacity: 0;
                //         visibility: hidden;
                //         transform: none;
                //         transition: all 0.3s ease;
                //         padding: 5px 0;
                //         border-radius: 4px;
                //         display: block;
                //         &:before{
                //             content: "";
                //             display: block;
                //             width: 0;
                //             height: 0;
                //             border-style: solid;
                //             border-width: 12px 18px 12px 0;
                //             border-color: transparent #242539 transparent transparent;
                //             position: absolute;
                //             top: 5px;
                //             left: 5px;
                //             transform: translateX(-100%)
                //         }
                //         .md-sidebar-item-router-link{
                //             background: transparent !important;
                //             .md-list-item-content{
                //                 padding: 5px 20px;
                //                 min-height: 28px;
                //                 >.md-icon:first-child{
                //                     display: none;
                //                 }
                //                 .md-list-item-text{
                //                     color:#fff;
                //                     display: block;
                //                     font-size: 13px;
                //                 }
                //             }
                //             &.is-actived{
                //                 color:#fff;
                //                 .md-list-item-text{
                //                     font-weight: 600;
                //                 }
                //             }
                //             &:hover{
                //                 text-decoration: underline;
                //             }
                //         }
                //         li{
                //             display: block;
                //             &:first-child{
                //                 display: block;
                //             }
                //         }
                //     }
                // }
            }
        }
    }
</style>
