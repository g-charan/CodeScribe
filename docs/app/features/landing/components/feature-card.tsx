import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { FeatureCardProps } from "../types";

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
  badge,
}: FeatureCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border-muted/50 hover:border-primary/20">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription className="leading-relaxed">
        {description}
      </CardDescription>
    </CardHeader>
    {href && (
      <CardContent className="pt-0">
        <Button
          variant="ghost"
          className="p-0 h-auto font-normal text-primary hover:text-primary/80"
        >
          Learn more <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    )}
  </Card>
);
