macro (.:) {
  case {_
    [$prop:expr] = $val:expr
  } => {
    return #{.set($prop, $val)}
  }

  case {_
    [$prop:expr]
  } => {
    return #{
      .get($prop)
    }
  }

  case {_
    $name:ident = $val:expr
  } => {
    letstx $name_str = [makeValue(unwrapSyntax(#{$name}), #{here})];
    return #{
      .set($name_str, $val)
    }
  }

  case {_
    $name:ident
  } => {
    letstx $name_str = [makeValue(unwrapSyntax(#{$name}), #{here})];
    return #{
      .get($name_str)
    }
  }
}

export (.:)

macro bind_args {
  case { $ctx $args $body ... } => {
    var stx = #{ $body ... };
    var args = #{ $args };

    function walk(stx) {
      for(var i=0; i<stx.length; i++) {
        var s = stx[i];
        if(s.token.type === parser.Token.Delimiter) {
          walk(s.token.inner);
        }
        else if(s.token.value === 'function') {
          var expr = getExpr(stx.slice(i));
          walk(expr.rest);
          break;
        }
        else if(s.token.type === parser.Token.Identifier &&
                s.token.value === 'arguments' &&
                (i === 0 || stx[i-1].token.value !== '.')) {
          s.token.value = '__fa_args';
        }
      }
    }

    walk(stx);
    return stx;
  }
}

macro (->) {
  case infix { ($arg (,) ...) | $ctx {$body ...} } => {
    letstx $args = [makeIdent('__fa_args', #{$ctx})];
    return #{
      function($args, $arg (,) ...) {
        bind_args $args $body ...
      }
    }
  }
  case infix { $arg:ident | $ctx {$body ...} } => {
    letstx $args = [makeIdent('__fa_args', #{$ctx})];
    return #{
      function($args, $arg) {
        bind_args $args $body ...
      }
    }
  }
  case infix { ($arg (,) ...) | $ctx $guard:expr } => {
    letstx $args = [makeIdent('__fa_args', #{$ctx})];
    return #{
      function ($args, $arg (,) ...) {
        return bind_args $args $guard;
      }
    }
  }
  case infix { $arg:ident | $ctx $guard:expr } => {
    letstx $args = [makeIdent('__fa_args', #{$ctx})];
    return #{
      function($args, $arg) {
        return bind_args $args $guard;
      }
    }
  }
}

export (->)
