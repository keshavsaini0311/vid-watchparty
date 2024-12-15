"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import React from "react"

import { useRouter } from "next/navigation"


export default function page() {
  const router = useRouter();
  const [SignUpdata, setSignUpdata] = React.useState({
    username: "",
    email: "",
    password: "",
  })

  const [LoginData, setLoginData] = React.useState({
    email: "",
    password: "",
  })
  
  const handleSignUp = async () => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(SignUpdata),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(LoginData),
      });
      const data = await res.json();
      if(data.success===false){
        toast.error("Invalid credentials");
        return
      }
      toast.success("Logged in successfully");
      router.push("/");
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className=" my-10">
    <Tabs defaultValue="SignUp" className="w-[400px] mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="SignUp">SignUp</TabsTrigger>
        <TabsTrigger value="Login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="SignUp">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Signup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" onChange={(e) => setSignUpdata({ ...SignUpdata, username: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="Email">Email</Label>
              <Input type="email" id="email" onChange={(e) => setSignUpdata({ ...SignUpdata, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="Password">Password</Label>
              <Input onChange={(e) => setSignUpdata({ ...SignUpdata, password: e.target.value })} type="password" id="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleSignUp} >Sign Up</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Login">
        <Card>
        <CardHeader>
            <CardTitle className="text-xl text-center">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="loginemail" type="email" onChange={(e) => setLoginData({ ...LoginData, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="loginpassword" type="password" onChange={(e) => setLoginData({ ...LoginData, password: e.target.value })} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleLogin}>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}
