import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Portfolio() {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl font-bold">Portfolio</h3>
      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <Label>Title</Label>
            <Input placeholder="Kenneth Bass' Portfolio" />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label>Description</Label>
            <Textarea placeholder="A place to store all my ideas!" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <p className="text-sm font-bold">https://github.com/</p>
              <Input placeholder="dishwasher-detergent" />
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <p className="text-sm font-bold">https://bitbucket.org/</p>
              <Input placeholder="dishwasher-detergent" />
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <p className="text-sm font-bold">https://bitbucket.org/</p>
              <Input placeholder="dishwasher-detergent" />
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <p className="text-sm font-bold">https://codepen.io/</p>
              <Input placeholder="kennethbass" />
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <p className="text-sm font-bold">https://twitter.com/</p>
              <Input placeholder="aNinjaHobo" />
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <p className="text-sm font-bold">https://www.linkedin.com/in/</p>
              <Input placeholder="kennethtylerbass" />
            </div>
          </div>
          {/* 
            bitbuck
            gitlab
            codepen
            twitter
            instagram
          */}
        </CardContent>
      </Card>
    </div>
  );
}
