import Text "mo:base/Text";

import Float "mo:base/Float";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

actor Calculator {
  public func calculate(x : Float, y : Float, op : Text) : async ?Float {
    switch (op) {
      case ("+") { ?Float.add(x, y) };
      case ("-") { ?Float.sub(x, y) };
      case ("*") { ?Float.mul(x, y) };
      case ("/") {
        if (y == 0) {
          Debug.print("Error: Division by zero");
          null
        } else {
          ?Float.div(x, y)
        }
      };
      case (_) {
        Debug.print("Error: Invalid operation");
        null
      };
    }
  };

  public func clear() : async () {
    // No state to clear in this simple implementation
    Debug.print("Calculator cleared");
  };
}
