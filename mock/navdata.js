'use client'
import { IconBellFilled, IconChartBar, IconHistory, IconNews, IconNotification, IconPhoto, IconUser, IconUserMinus, IconWorld } from "@tabler/icons-react";
import { LogOut } from "lucide-react";

export const navdata = [
    {icon : IconUser, item : "User",path :"/admin/users"},
    {icon : IconUserMinus, item : "Roles",path :"/admin/roles"},
    {icon : IconNews, item : "News",path :"/admin/news"},
    {icon : IconWorld, item : "TodoList",path :"/admin/Todo_List"},
    {icon : IconBellFilled, item : "Notification",path :"/admin/notifikasi"},
    {icon : IconHistory, item : "History",path :"/admin/riwayat"},
    {icon : IconChartBar, item : "Statistik",path :"/admin/Statistik"},
    {icon : LogOut, item : "Logout",path :"../"}
]