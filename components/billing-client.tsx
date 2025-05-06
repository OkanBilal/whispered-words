"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { P } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function BillingClient() {
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [currentPlan] = useState("free");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Your Plan
      </h1>
      <P className="text-white mb-6">
        Your current plan is <span className="bg-black text-white px-2 py-1 rounded-full border border-gray-800 text-sm">Free</span>
      </P>

      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="billing-toggle" className="text-white">Monthly</Label>
          <Switch 
            id="billing-toggle" 
            checked={yearlyBilling} 
            onCheckedChange={setYearlyBilling}
            className="bg-gray-700 data-[state=checked]:bg-white"
          />
          <Label htmlFor="billing-toggle" className="text-white">
            Annual <span className="text-xs text-gray-400">2 months free</span>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className={`p-6 shadow-lg rounded-lg border ${currentPlan === 'free' ? 'border-white' : 'border-gray-700'}`}>
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-white">Free</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <P className="text-gray-200 mb-4">Get started now and upgrade once you reach the limits.</P>
            <P className="text-3xl font-bold text-white mb-6">$0 <span className="text-sm font-normal text-gray-400">/month</span></P>
            
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">Accurate and faster responses with fine-tuned AI model</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">Limited transcription length (15 min)</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">Limited export formats</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">10 transcriptions per month</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-lg rounded-lg border border-gray-700 bg-black">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold">
              Pro <span className="text-yellow-400">✨</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <P className="text-gray-300 mb-4">Create transcriptions without limits.</P>
            <P className="text-3xl font-bold text-white mb-6">
              ${yearlyBilling ? '2.49' : '2.99'} <span className="text-sm font-normal text-gray-400">{yearlyBilling ? '/month' : '/month'}</span>
            </P>

            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">Accurate and faster responses with fine-tuned AI model</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">Unlimited transcription length</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">All export formats supported</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">100 transcriptions per month</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">Translation to any language</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">Post-processing with GPT-4</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-2">-</span>
                <span className="text-gray-300">Dedicated support</span>
              </li>
            </ul>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Switch
                  id="yearly-toggle"
                  checked={yearlyBilling}
                  onCheckedChange={setYearlyBilling}
                  className="bg-gray-700 data-[state=checked]:bg-white mr-2"
                />
                <Label htmlFor="yearly-toggle" className="text-sm text-gray-300">
                  2 months free with annual plan
                </Label>
              </div>
            </div>

            <Button className="w-full justify-center bg-white text-black hover:bg-neutral-200 rounded-md px-4 py-2 border border-neutral-800 text-sm font-semibold transition-all duration-200">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-8">
        <Button className="bg-transparent border border-gray-700 hover:bg-black text-white">
          Manage Subscription
        </Button>
      </div>
    </div>
  );
}
